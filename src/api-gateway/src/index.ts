import { CustomersController } from '@api/controllers/customers.controller';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config();

(async () => {
  const service = new ServiceBuilder()
    .useRabbitMQ('amqp://localhost')
    .setName('api-gateway')
    .setCommandHandlers([])
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([])
    .setControllers([asClass(CustomersController).singleton()])
    .setQueryHandlers([])
    .useConsul('http://localhost:8500')
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
