import { FraudController } from '@api/fraud/fraud.controller';
import { Server } from '@api/server';
import { FraudCheckServiceImpl } from '@app/services/fraud-check-service/fraud-check.service';
import { ConsulServiceDiscovery, ContainerBuilder, TracerBuilder } from '@krater/building-blocks';
import { asClass, asValue } from 'awilix';
import * as opentracing from 'opentracing';

export const container = () => {
  const tracerBuilder = new TracerBuilder('fraud').build();

  opentracing.initGlobalTracer(tracerBuilder);

  const tracer = opentracing.globalTracer();

  const appContainer = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .setControllers([asClass(FraudController).singleton()])
    .setCustom({
      server: asClass(Server).singleton(),
      fraudCheckService: asClass(FraudCheckServiceImpl).singleton(),
      serviceDiscovery: asClass(ConsulServiceDiscovery)
        .inject(() => ({
          consulUrl: 'http://localhost:8500',
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
