import { EventSubscriber, Logger } from '@krater/building-blocks';
import { CustomerCreatedEvent } from '@root/integration-events/customer-created.event';

interface Dependencies {
  logger: Logger;
}

export class CustomerCreatedSubscriber implements EventSubscriber<CustomerCreatedEvent> {
  public readonly type = `customers.${CustomerCreatedEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: CustomerCreatedEvent) {
    this.dependencies.logger.info('Accepting event in subscriber');
    this.dependencies.logger.info(JSON.stringify(event, null, 2));
  }
}
