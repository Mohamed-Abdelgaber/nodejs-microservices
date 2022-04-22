import { config } from 'dotenv';
import { SayHelloSubscriber } from '@app/subscribers/say-hello/say-hello.subscriber';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('catalogue')
    .useRabbitMQ('amqp://localhost')
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setControllers([])
    .loadActions([])
    .useConsul('http://localhost:8500')
    .setEventSubscribers([asClass(SayHelloSubscriber).singleton()])
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
