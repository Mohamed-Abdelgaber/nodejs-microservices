import { Command } from '@app/command';
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

    await this.channel.assertExchange(this.dependencies.serviceName, 'headers', {
      durable: true,
    });
  }

  public async sendCommand(command: Command<{}>, context: MessageContext): Promise<void> {
    this.channel.publish(
      this.dependencies.serviceName,
      '',
      Buffer.from(JSON.stringify({ payload: command.payload, context })),
      {
        headers: {
          service: this.dependencies.serviceName,
          command: command.constructor.name,
          type: MessageType.Command,
        },
      },
    );
  }

  public async sendEvent(event: DomainEvent<{}>, context: MessageContext): Promise<void> {
    this.channel.publish(
      this.dependencies.serviceName,
      '',
      Buffer.from(JSON.stringify({ payload: event.payload, context })),
      {
        headers: {
          service: this.dependencies.serviceName,
          event: event.constructor.name,
          type: MessageType.Event,
        },
      },
    );
  }

  public async subscribeToCommand(
    command: string,
    service: string,
    callback: (command: Command, context: MessageContext) => Promise<void>,
  ): Promise<void> {
    await this.channel.assertQueue(`${service}.${command}`);

    await this.channel.bindQueue(`${service}.${command}`, service, '', {
      service,
      'x-match': 'all',
      type: MessageType.Command,
      command: command,
    });

    await this.channel.consume(`${service}.${command}`, async (message) => {
      const { payload, context } = JSON.parse(message.content.toString());

      await callback(new Command(service, payload), context);

      this.channel.ack(message);
    });
  }

  public async subscribeToEvent(
    event: string,
    service: string,
    callback: (EventType: DomainEvent<unknown>, context: MessageContext) => Promise<void>,
  ): Promise<void> {
    await this.channel.assertQueue(`${service}.${event}`);

    await this.channel.bindQueue('', service, '', {
      service,
      'x-match': 'all',
      type: MessageType.Event,
      event: event,
    });

    await this.channel.consume(`${service}.${event}`, async (message) => {
      const { payload, context } = JSON.parse(message.content.toString());

      await callback(new DomainEvent(service, payload), context);

      this.channel.ack(message);
    });
  }
}
