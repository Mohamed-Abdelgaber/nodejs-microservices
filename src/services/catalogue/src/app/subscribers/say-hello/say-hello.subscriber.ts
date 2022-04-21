import { SayHelloEvent } from '@core/events/say-hello.event';
import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';

interface Dependencies {
  logger: Logger;
}

export class SayHelloSubscriber implements EventSubscriber<SayHelloEvent> {
  public readonly type = `customers.${SayHelloEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: SayHelloEvent, messageContext: MessageContext): Promise<void> {
    this.dependencies.logger.info(JSON.stringify(messageContext));

    this.dependencies.logger.info(`Catalogue - ${event.payload.message}`);
  }
}
