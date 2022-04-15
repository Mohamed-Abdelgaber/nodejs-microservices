import { CustomersController } from '@api/customers/customers.controller';
import { Server } from '@api/server';
import { CreateCustomerCommandHandler } from '@app/commands/create-customer/create-customer.command-handler';
import {
  ContainerBuilder,
  ConsulServiceDiscovery,
  RabbitMqMessageBus,
  TracerBuilder,
} from '@krater/building-blocks';
import { asClass, asValue } from 'awilix';
import * as opentracing from 'opentracing';

export const container = () => {
  const tracerBuilder = new TracerBuilder('customers').build();

  opentracing.initGlobalTracer(tracerBuilder);

  const tracer = opentracing.globalTracer();

  const appContainer = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([asClass(CreateCustomerCommandHandler).singleton()])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .setControllers([asClass(CustomersController).singleton()])
    .setCustom({
      server: asClass(Server).singleton(),
      serviceDiscovery: asClass(ConsulServiceDiscovery)
        .inject(() => ({ consulUrl: 'http://localhost:8500' }))
        .singleton(),
      messageBus: asClass(RabbitMqMessageBus)
        .inject(() => ({
          rabbitUrl: 'amqp://localhost',
          serviceName: 'customers',
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
