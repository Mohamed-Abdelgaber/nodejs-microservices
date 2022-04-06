import { CustomersController } from '@api/customers/customers.controller';
import { Server } from '@api/server';
import { CreateCustomerCommandHandler } from '@app/commands/create-customer/create-customer.command-handler';
import { ContainerBuilder } from '@krater/building-blocks';
import { asClass, asValue } from 'awilix';

export const container = () => {
  const appContainer = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([asClass(CreateCustomerCommandHandler).singleton()])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .setControllers([asClass(CustomersController).singleton()])
    .setCustom({
      server: asClass(Server).singleton(),
    })
    .build();

  const server = appContainer.resolve<Server>('server');

  appContainer.register({
    app: asValue(server.getApp()),
  });

  return appContainer;
};
