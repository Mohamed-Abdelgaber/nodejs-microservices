import { CatalogueController } from '@api/catalogue/catalogue.controller';
import { FraudController } from '@api/fraud/fraud.controller';
import { IdentityController } from '@api/identity/identity.controller';
import { authMiddleware } from '@api/middlewares/auth.middleware';
import corsMiddleware from '@api/middlewares/cors/cors.middleware';
import { errorHandlerMiddleware } from '@api/middlewares/error-handler/error-handler.middleware';
import { applySecurityMiddleware } from '@api/middlewares/security/security.middleware';
import { openApiDocs } from '@infrastructure/open-api/open-api.docs';
import { Logger, NotFoundError, ServiceBuilder } from '@krater/building-blocks';
import { asClass, asFunction } from 'awilix';
import { config } from 'dotenv';
import * as swaggerUI from 'swagger-ui-express';

config();

(async () => {
  const service = new ServiceBuilder()
    .useRabbitMQ('amqp://localhost')
    .setName('api-gateway')
    .setCommandHandlers([])
    .setServiceControllers([])
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([])
    .setControllers([
      asClass(FraudController).singleton(),
      asClass(IdentityController).singleton(),
      asClass(CatalogueController).singleton(),
    ])
    .setQueryHandlers([])
    .useConsul('http://localhost:8500')
    .setCustom({
      authMiddleware: asFunction(authMiddleware),
    })
    .build();

  const logger = service.getContainer().resolve<Logger>('logger');

  await service.bootstrap();

  service.getApp().use(corsMiddleware);

  applySecurityMiddleware(service.getApp());

  service.getApp().use(corsMiddleware);

  service.getApp().use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiDocs));

  service.getApp().use('*', (req, _, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} does not exist.`));
  });

  service.getApp().use(errorHandlerMiddleware(logger));

  const port = Number(process.env.APP_PORT) ?? 4000;

  service.listen(port);
})();
