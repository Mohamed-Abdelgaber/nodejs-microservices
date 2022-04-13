import { Command } from '@app/command';
import { DomainEvent } from '@core/domain-event';

export interface MessageContext {
  resourceId: string;
}

export interface MessageBus {
  init(): Promise<void>;

  subscribeToCommand(
    command: string,
    service: string,
    callback: (command: Command, context: MessageContext) => Promise<void>,
  ): Promise<void>;

  subscribeToEvent(
    event: string,
    service: string,
    callback: (EventType: DomainEvent<unknown>, context: MessageContext) => Promise<void>,
  ): Promise<void>;

  sendCommand(command: Command, context: MessageContext): Promise<void>;

  sendEvent(event: DomainEvent<unknown>, context: MessageContext): Promise<void>;
}
