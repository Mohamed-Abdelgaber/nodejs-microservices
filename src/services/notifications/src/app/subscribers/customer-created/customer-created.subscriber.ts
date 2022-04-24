import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { CustomerCreatedEvent } from '@root/integration-events/customer-created.event';
import { Tracer, FORMAT_HTTP_HEADERS } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

export class CustomerCreatedSubscriber implements EventSubscriber<CustomerCreatedEvent> {
  public readonly type = `customers.${CustomerCreatedEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: CustomerCreatedEvent, context: MessageContext) {
    this.dependencies.logger.info(`Sending welcome email to "${event.payload.email}".`);

    const ctx = this.dependencies.tracer.extract(FORMAT_HTTP_HEADERS, context.spanContext);

    const span = this.dependencies.tracer.startSpan('Send email notification to Customer', {
      childOf: ctx,
    });

    // await wait(2000);

    span.finish();
  }
}
