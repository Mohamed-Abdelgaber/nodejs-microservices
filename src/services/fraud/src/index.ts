import { config } from 'dotenv';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { FraudController } from '@api/fraud/fraud.controller';
import { FraudCheckServiceImpl } from '@app/services/fraud-check-service/fraud-check.service';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('fraud')
    .useRabbitMQ('amqp://localhost')
    .useConsul('http://localhost:8500')
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setControllers([asClass(FraudController)])
    .setEventSubscribers([])
    .setCustom({
      fraudCheckService: asClass(FraudCheckServiceImpl).singleton(),
    })
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
