import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { CustomerCreatedEvent } from '@root/integration-events/customer-created.event';
import { Tracer, FORMAT_TEXT_MAP } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class CustomerCreatedSubscriber implements EventSubscriber<CustomerCreatedEvent> {
  public readonly type = `customers.${CustomerCreatedEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: CustomerCreatedEvent, context: MessageContext) {
    this.dependencies.logger.info(`Sending welcome email to "${event.payload.email}".`);

    const ctx = this.dependencies.tracer.extract(FORMAT_TEXT_MAP, context.spanContext);

    const span = this.dependencies.tracer.startSpan('send notification', {
      childOf: ctx,
    });

    await delay(2000);

    span.finish();
  }
}
