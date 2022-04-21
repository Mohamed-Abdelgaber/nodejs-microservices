import { SayHelloCommandHandler } from '@app/commands/say-hello/say-hello.command-handler';
import { SayHelloSubscriber } from '@app/subscribers/say-hello/say-hello.subscriber';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';

(async () => {
  const service = new ServiceBuilder()
    .setName('catalogue')
    .useRabbitMQ('amqp://localhost')
    .setCommandHandlers([asClass(SayHelloCommandHandler).singleton()])
    .setEventSubscribers([asClass(SayHelloSubscriber).singleton()])
    .setControllers([])
    .build();

  await service.listen(6100);
})();
