/* eslint-disable import/first */
require('dotenv').config();

import { Logger, MessageBus, ServiceDiscovery } from '@krater/building-blocks';
import { Application } from 'express';
import { container } from './container';
import Vault from 'node-vault';

(async () => {
  const appContainer = container();

  const app = appContainer.resolve<Application>('app');
  const logger = appContainer.resolve<Logger>('logger');

  const serviceDiscovery = appContainer.resolve<ServiceDiscovery>('serviceDiscovery');

  const messageBus = appContainer.resolve<MessageBus>('messageBus');

  await messageBus.init();

  const PORT = process.env.APP_PORT ?? 4000;

  const vault = Vault({
    endpoint: 'http://127.0.0.1:8200',
    apiVersion: 'v1',
  });

  const result = await vault.approleLogin({
    role_id: process.env.ROLE_ID,
    secret_id: process.env.SECRET_ID,
  });

  vault.token = result.auth.client_token;

  const { data } = await vault.read('secret/data/customers-service/config', {});

  app.listen(PORT, async () => {
    logger.info(`${data.data.name} listening on http://localhost:${PORT}`);

    await serviceDiscovery.registerService({
      address: '127.0.0.1',
      port: Number(PORT),
      name: 'customers',
      health: {
        endpoint: '/health',
        intervalSeconds: 5,
        timeoutSeconds: 5,
      },
    });
  });
})();
