import { ServiceBuilder } from '@krater/building-blocks';
import { config } from 'dotenv';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('api-gateway')
    .useRabbitMQ('amqp://localhost')
    .useConsul('http://localhost:8500')
    .loadActions([])
    .setCommandHandlers([])
    .setControllers([])
    .setEventSubscribers([])
    .setQueryHandlers([])
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
