import { CustomersController } from '@api/customers/customers.controller';
import { CreateCustomerCommandHandler } from '@app/commands/create-customer/create-customer.command-handler';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config();

(async () => {
  const service = new ServiceBuilder()
    .useRabbitMQ('amqp://localhost')
    .setName('customers')
    .setCommandHandlers([asClass(CreateCustomerCommandHandler).singleton()])
    .setControllers([asClass(CustomersController).singleton()])
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([])
    .build();

  const port = Number(process.env.APP_PORT) || 4000;

  await service.listen(port);
})();
