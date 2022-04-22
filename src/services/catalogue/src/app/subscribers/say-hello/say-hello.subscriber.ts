import { SayHelloEvent } from '@core/events/say-hello.event';
import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { FORMAT_TEXT_MAP, Tracer } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

export class SayHelloSubscriber implements EventSubscriber<SayHelloEvent> {
  public readonly type = `customers.${SayHelloEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: SayHelloEvent, messageContext: MessageContext): Promise<void> {
    this.dependencies.logger.info(JSON.stringify(messageContext));

    const ctx = this.dependencies.tracer.extract(FORMAT_TEXT_MAP, messageContext.spanContext);

    const span = this.dependencies.tracer.startSpan('Say Hello Subscriber', {
      childOf: ctx,
    });

    this.dependencies.logger.info(`Catalogue - ${event.payload.message}`);

    await wait(2000);

    span.finish();
  }
}
