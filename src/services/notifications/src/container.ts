import { Server } from '@api/server';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import {
  ConsulServiceDiscovery,
  ContainerBuilder,
  RabbitMqMessageBus,
  TracerBuilder,
} from '@krater/building-blocks';
import { asClass, asValue } from 'awilix';
import * as opentracing from 'opentracing';

export const container = () => {
  const tracerBuilder = new TracerBuilder('notifications').build();

  opentracing.initGlobalTracer(tracerBuilder);

  const tracer = opentracing.globalTracer();

  const appContainer = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([asClass(NewAccountRegisteredSubscriber).singleton()])
    .setControllers([])
    .setCustom({
      server: asClass(Server).singleton(),
      serviceDiscovery: asClass(ConsulServiceDiscovery)
        .inject(() => ({ consulUrl: 'http://localhost:8500' }))
        .singleton(),
      messageBus: asClass(RabbitMqMessageBus)
        .inject(() => ({
          rabbitUrl: 'amqp://localhost',
          serviceName: 'notifications',
        }))
        .singleton(),
      tracer: asValue(tracer),
    })
    .build();

  const server = appContainer.resolve<Server>('server');

  appContainer.register({
    app: asValue(server.getApp()),
  });

  return appContainer;
};
