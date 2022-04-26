import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { NewAccountRegisteredEvent } from '@root/integration-events/new-account-registered.event';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = `identity.${NewAccountRegisteredEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    event: NewAccountRegisteredEvent,
    messageContext: MessageContext,
  ): Promise<void> {
    this.dependencies.logger.info(`Sending welcome email to ${event.payload.email}`);

    const ctx = this.dependencies.tracer.extract(FORMAT_HTTP_HEADERS, messageContext.spanContext);

    const span = this.dependencies.tracer.startSpan(
      '[Subscriber] Send email notification to newly registered user',
      {
        childOf: ctx,
      },
    );

    span.addTags({
      'x-type': 'subscriber',
    });

    span.finish();
  }
}
