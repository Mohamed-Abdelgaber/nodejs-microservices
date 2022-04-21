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
} from '..';
import { registerAsArray } from './container';
import { Logger, logger } from './logger';
import { MessageBus, RabbitMqMessageBus } from './message-bus';
import { TracerBuilder } from './tracer';
import * as opentracing from 'opentracing';

export class ServiceBuilder {
  private serviceName: string;

  private container: AwilixContainer = createContainer();

  constructor() {
    this.container.register({
      logger: asValue(logger),
    });
  }

  public setName(name: string) {
    this.serviceName = name;

    const tracerBuilder = new TracerBuilder(name).build();

    opentracing.initGlobalTracer(tracerBuilder);

    const tracer = opentracing.globalTracer();

    this.container.register({
      tracer: asValue(tracer),
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
    if (!this.container.hasRegistration('messageBus')) {
      throw new Error("Can't subscribe to command. Message Bus is not set.");
    }

    this.container.register({
      commandHandlers: registerAsArray(commandHandlers),
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

  public build() {
    return {
      listen: async (port: number) => {
        const logger = this.container.resolve<Logger>('logger');

        logger.info('Loading service dependencies...');

        this.container.register({
          server: asClass(Server).singleton(),
        });

        this.loadBrokers();

        const messageBus = this.container.resolve<MessageBus>('messageBus');

        await messageBus.init();

        await Promise.all([this.registerCommandHandlers(), this.registerEventSubscribers()]);

        const server = this.container.resolve<Server>('server');

        this.container.register({
          app: asValue(server.getApp()),
        });

        const app = this.container.resolve<Application>('app');

        app.listen(port, () => {
          logger.info(`Service started listening on http://localhost:${port}`);
        });
      },
    };
  }

  private loadBrokers() {
    this.container.register({
      commandBus: asClass(InMemoryCommandBus).singleton(),
      queryBus: asClass(InMemoryQueryBus).singleton(),
    });
  }

  private async registerCommandHandlers() {
    const commandHandlers = this.container.resolve<CommandHandler<any, any>[]>('commandHandlers');
    const messageBus = this.container.resolve<MessageBus>('messageBus');

    const promises = commandHandlers.map((commandHandler) => {
      return messageBus.subscribeToCommand(
        this.getConstructorName(commandHandler).replace('Handler', ''),
        this.serviceName,
        (command, context) => commandHandler.handle(command, context),
      );
    });
    await Promise.all(promises);
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

  private getConstructorName(object: object) {
    return object.constructor.name;
  }
}
