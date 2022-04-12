/* eslint-disable import/first */
require('dotenv').config();
import { Logger, ServiceDiscovery } from '@krater/building-blocks';
import { Application } from 'express';
import { container } from './container';

(async () => {
  const appContainer = container();

  const app = appContainer.resolve<Application>('app');
  const logger = appContainer.resolve<Logger>('logger');

  const serviceDiscovery = appContainer.resolve<ServiceDiscovery>('serviceDiscovery');

  const PORT = process.env.APP_PORT ?? 4000;

  app.listen(PORT, async () => {
    logger.info(`Notifications service listening on http://localhost:${PORT}`);

    await serviceDiscovery.registerService({
      address: '127.0.0.1',
      port: Number(PORT),
      name: 'notifications',
      health: {
        endpoint: '/health',
      },
    });
  });
})();
