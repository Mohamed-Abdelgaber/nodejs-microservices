import { config } from 'dotenv';
import { ServiceBuilder } from '@krater/building-blocks';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('identity')
    .useRabbitMQ('amqp://localhost')
    .useConsul('http://localhost:8500')
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setControllers([])
    .setEventSubscribers([])
    .setQueryHandlers([])
    .build();

  await service.bootstrap();

  const port = Number(process.env.APP_PORT) ?? 4000;

  service.listen(port);
})();
