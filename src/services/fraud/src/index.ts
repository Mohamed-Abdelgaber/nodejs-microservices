require('dotenv').config();
// import dotenv from 'dotenv';
import { Logger } from '@krater/building-blocks';
import { Application } from 'express';
import { container } from './container';

// dotenv.config();

(async () => {
  const appContainer = container();

  const app = appContainer.resolve<Application>('app');
  const logger = appContainer.resolve<Logger>('logger');

  const PORT = process.env.APP_PORT ?? 4000;

  app.listen(PORT, async () => {
    logger.info(`Fraud service listening on http://localhost:${PORT}`);
  });
})();
