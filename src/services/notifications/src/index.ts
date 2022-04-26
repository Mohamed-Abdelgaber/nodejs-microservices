import { CustomerCreatedSubscriber } from '@app/subscribers/customer-created/customer-created.subscriber';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('notifications')
    .useRabbitMQ('amqp://localhost')
    .useConsul('http://localhost:8500')
    .setCommandHandlers([])
    .setControllers([])
    .setQueryHandlers([])
    .setEventSubscribers([
      asClass(CustomerCreatedSubscriber).singleton(),
      asClass(NewAccountRegisteredSubscriber).singleton(),
    ])
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
