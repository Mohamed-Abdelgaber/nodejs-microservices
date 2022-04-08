/* eslint-disable no-console */
/* eslint-disable import/first */
require('dotenv').config();
// import dotenv from 'dotenv';
import { Logger } from '@krater/building-blocks';
import { Application } from 'express';
import Consul from 'consul';
import { container } from './container';

(async () => {
  const appContainer = container();

  const app = appContainer.resolve<Application>('app');
  const logger = appContainer.resolve<Logger>('logger');

  const PORT = process.env.APP_PORT ?? 4000;

  app.listen(PORT, async () => {
    logger.info(`Customer service listening on http://localhost:${PORT}`);

    const consul = new Consul({
      host: '127.0.0.1',
      port: '8500',
      promisify: true,
      secure: false,
    });

    // @ts-ignore
    consul.agent.service.register({
      name: 'customers-ms',
      Address: '192.168.0.255',
      port: PORT,
    });
  });
})();
