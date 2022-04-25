import { CustomersController } from '@api/customers/customers.controller';
import { FraudController } from '@api/fraud/fraud.controller';
import { openApiDocs } from '@infrastructure/open-api/open-api.docs';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';
import * as swaggerUI from 'swagger-ui-express';

config();

(async () => {
  const service = new ServiceBuilder()
    .useRabbitMQ('amqp://localhost')
    .setName('api-gateway')
    .setCommandHandlers([])
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([])
    .setControllers([
      asClass(CustomersController).singleton(),
      asClass(FraudController).singleton(),
    ])
    .setQueryHandlers([])
    .useConsul('http://localhost:8500')
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.getApp().use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiDocs));

  service.listen(port);
})();
