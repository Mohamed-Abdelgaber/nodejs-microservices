import { Server } from '@api/server';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
  Lifetime,
  Resolver,
} from 'awilix';
import { Application } from 'express';
import {
  CommandHandler,
  Controller,
  EventSubscriber,
  InMemoryCommandBus,
  InMemoryQueryBus,
  QueryHandler,
  tracingMiddleware,
} from '..';
import { registerAsArray } from './container';
import { Logger, logger } from './logger';
import { MessageBus, RabbitMqMessageBus } from './message-bus';
import { TracerBuilder } from './tracer';
import * as opentracing from 'opentracing';
import { ConsulServiceDiscovery, ServiceDiscovery } from './service-discovery';

interface CustomResolution {
  [key: string]: Resolver<any>;
}

export class ServiceBuilder {
  private serviceName: string;

  private container: AwilixContainer = createContainer();

  public setName(name: string) {
    this.serviceName = name;

    this.container.register({
      logger: asValue(logger(name)),
    });

    const tracerBuilder = new TracerBuilder(name).build();

    opentracing.initGlobalTracer(tracerBuilder);

    const tracer = opentracing.globalTracer();

    this.container.register({
      tracer: asValue(tracer),
      tracingMiddleware: asFunction(tracingMiddleware),
    });

    return this;
  }

  public setControllers(controllers: Resolver<Controller>[]) {
    this.container.register({
      controllers: registerAsArray(controllers),
    });

    return this;
  }

  public loadActions(actionPaths: string[]) {
    this.container.loadModules(actionPaths, {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SCOPED,
        register: asFunction,
      },
    });

    return this;
  }

  public setCommandHandlers(commandHandlers: Resolver<CommandHandler<any, any>>[]) {
    this.container.register({
      commandHandlers: registerAsArray(commandHandlers),
      commandBus: asClass(InMemoryCommandBus).singleton(),
    });

    return this;
  }

  public setQueryHandlers(queryHandlers: Resolver<QueryHandler<any, any>>[]) {
    this.container.register({
      queryHandlers: registerAsArray(queryHandlers),
      queryBus: asClass(InMemoryQueryBus).singleton(),
    });

    return this;
  }

  public setEventSubscribers(eventSubscribers: Resolver<EventSubscriber<any>>[]) {
    if (!this.container.hasRegistration('messageBus')) {
      throw new Error("Can't subscribe to command. Message Bus is not set.");
    }

    this.container.register({
      subscribers: registerAsArray(eventSubscribers),
    });

    return this;
  }

  public useRabbitMQ(url: string) {
    this.container.register({
      messageBus: asClass(RabbitMqMessageBus)
        .inject(() => ({
          rabbitUrl: url,
          serviceName: this.serviceName,
        }))
        .singleton(),
    });

    return this;
  }

  public useConsul(url: string) {
    this.container.register({
      serviceDiscovery: asClass(ConsulServiceDiscovery)
        .inject(() => ({
          consulUrl: url,
        }))
        .singleton(),
    });

    return this;
  }

  public setCustom(props: CustomResolution) {
    this.container.register(props);

    return this;
  }

  public build() {
    return {
      bootstrap: async () => {
        const logger = this.container.resolve<Logger>('logger');

        logger.info('Loading service dependencies...');

        this.container.register({
          server: asClass(Server).singleton(),
        });

        const messageBus = this.container.resolve<MessageBus>('messageBus');

        await messageBus.init();

        this.registerEventSubscribers();

        const server = this.container.resolve<Server>('server');

        this.container.register({
          app: asValue(server.getApp()),
        });
      },
      listen: (port: number) => this.listen(port),
      getApp: () => {
        const app = this.container.resolve<Application>('app');

        return app;
      },
    };
  }

  public listen(port: number) {
    const app = this.container.resolve<Application>('app');

    const serviceDiscovery = this.container.resolve<ServiceDiscovery>('serviceDiscovery');
    const logger = this.container.resolve<Logger>('logger');

    app.listen(port, async () => {
      await serviceDiscovery.registerService({
        port,
        address: '127.0.0.1',
        name: this.serviceName,
        health: {
          endpoint: '/health',
          intervalSeconds: 5,
          timeoutSeconds: 5,
        },
      });

      logger.info(`Service started listening on http://localhost:${port}`, {
        port,
      });
    });
  }

  private async registerEventSubscribers() {
    const subscribers = this.container.resolve<EventSubscriber<any>[]>('subscribers');
    const messageBus = this.container.resolve<MessageBus>('messageBus');

    const promises = subscribers.map((subscriber) => {
      const [service, event] = subscriber.type.split('.');

      return messageBus.subscribeToEvent(event, service, (event, ctx) =>
        subscriber.handle(event, ctx),
      );
    });
    await Promise.all(promises);
  }
}
