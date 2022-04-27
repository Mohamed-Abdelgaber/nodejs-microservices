import { DomainEvent } from '@core/domain-event';
import { MessageBus, MessageContext } from '../message-bus';
import amqp, { Channel } from 'amqplib';
import { CommandBus } from '@app/command-bus';
import { EventSubscriber } from '@app/event-subscriber';

interface Dependencies {
  commandBus: CommandBus;
  subscribers: EventSubscriber<any>[];
  rabbitUrl: string;
  serviceName: string;
}

export enum MessageType {
  Command = 'Command',
  Event = 'Event',
}

export class RabbitMqMessageBus implements MessageBus {
  private channel: Channel;

  constructor(private readonly dependencies: Dependencies) {}

  public async init() {
    const connection = await amqp.connect(this.dependencies.rabbitUrl);

    this.channel = await connection.createChannel();

    await this.channel.assertExchange(this.dependencies.serviceName, 'topic', {
      durable: true,
    });
  }

  public async sendEvent(event: DomainEvent<{}>, context: MessageContext): Promise<void> {
    this.channel.publish(
      this.dependencies.serviceName,
      `${event.service}.${event.constructor.name}`,
      Buffer.from(JSON.stringify({ payload: event.payload, context })),
    );
  }

  public async subscribeToEvent(
    event: string,
    service: string,
    callback: (EventType: DomainEvent<unknown>, context: MessageContext) => Promise<void>,
  ): Promise<void> {
    await this.channel.assertExchange(service, 'topic', {
      durable: true,
    });

    await this.channel.assertQueue('', { exclusive: true });

    await this.channel.bindQueue('', service, `${service}.${event}`);

    await this.channel.consume('', async (message) => {
      const { payload, context } = JSON.parse(message.content.toString());

      await callback(new DomainEvent(service, payload), context);

      this.channel.ack(message);
    });
  }
}
