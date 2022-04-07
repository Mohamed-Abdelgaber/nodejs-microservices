import { FraudController } from '@api/fraud/fraud.controller';
import { Server } from '@api/server';
import { FraudCheckServiceImpl } from '@app/services/fraud-check-service/fraud-check.service';
import { ContainerBuilder } from '@krater/building-blocks';
import { asClass, asValue } from 'awilix';

export const container = () => {
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
    })
    .build();

  const server = appContainer.resolve<Server>('server');

  appContainer.register({
    app: asValue(server.getApp()),
  });

  return appContainer;
};
