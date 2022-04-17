import {
  ConsulServiceDiscovery,
  ContainerBuilder,
  RabbitMqMessageBus,
  TracerBuilder,
} from '@krater/building-blocks';
import * as opentracing from 'opentracing';
import { asClass, asValue } from 'awilix';
import { Server } from '@api/server';

export const container = () => {
  const tracerBuilder = new TracerBuilder('api-gateway').build();

  opentracing.initGlobalTracer(tracerBuilder);

  const tracer = opentracing.globalTracer();

  const appContainer = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .setControllers([])
    .setCustom({
      serviceDiscovery: asClass(ConsulServiceDiscovery)
        .inject(() => ({
          consulUrl: 'http://localhost:8500',
        }))
        .singleton(),
      messageBus: asClass(RabbitMqMessageBus)
        .inject(() => ({
          rabbitUrl: 'amqp://localhost',
          serviceName: 'api-gateway',
        }))
        .singleton(),
      tracer: asValue(tracer),
      server: asClass(Server).singleton(),
    })
    .build();

  const server = appContainer.resolve<Server>('server');

  appContainer.register({
    app: asValue(server.getApp()),
  });

  return appContainer;
};
