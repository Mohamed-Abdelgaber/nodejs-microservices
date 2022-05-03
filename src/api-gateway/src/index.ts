import { FraudController } from '@api/fraud/fraud.controller';
import { IdentityController } from '@api/identity/identity.controller';
import { authMiddleware } from '@api/middlewares/auth.middleware';
import { openApiDocs } from '@infrastructure/open-api/open-api.docs';
import { ServiceBuilder } from '@krater/building-blocks';
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
    .setControllers([asClass(FraudController).singleton(), asClass(IdentityController).singleton()])
    .setQueryHandlers([])
    .useConsul('http://localhost:8500')
    .setCustom({
      authMiddleware: asFunction(authMiddleware),
    })
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.getApp().use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiDocs));

  service.listen(port);
})();
