import { Server } from '@api/server';
import { CustomerCreatedSubscriber } from '@app/subscribers/customer-created/customer-created.subscriber';
import {
  ConsulServiceDiscovery,
  ContainerBuilder,
  RabbitMqMessageBus,
} from '@krater/building-blocks';
import { asClass, asValue } from 'awilix';

export const container = () => {
  const appContainer = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([asClass(CustomerCreatedSubscriber).singleton()])
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
    })
    .build();

  const server = appContainer.resolve<Server>('server');

  appContainer.register({
    app: asValue(server.getApp()),
  });

  return appContainer;
};
