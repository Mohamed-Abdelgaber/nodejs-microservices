import { CreateCustomerCommandHandler } from '@app/commands/create-customer/create-customer.command-handler';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { CustomerRepositoryImpl } from '@infrastructure/customer/customer.repository';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config();

(async () => {
  const service = new ServiceBuilder()
    .useRabbitMQ('amqp://localhost')
    .setName('customers')
    .useMongo('mongodb://localhost:27017/customers')
    .setCommandHandlers([asClass(CreateCustomerCommandHandler).singleton()])
    .setControllers([])
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([asClass(NewAccountRegisteredSubscriber).singleton()])
    .setQueryHandlers([])
    .setCustom({
      customerRepository: asClass(CustomerRepositoryImpl).singleton(),
    })
    .useConsul('http://localhost:8500')
    .build();

  const port = Number(process.env.APP_PORT) || 4000;

  await service.bootstrap();

  service.getApp().get('/test', (_, res) => {
    res.status(200).json({
      message: 'Howdy',
    });
  });

  service.listen(port);
})();
