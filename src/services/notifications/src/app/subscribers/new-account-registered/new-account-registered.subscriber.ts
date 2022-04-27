import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { NewAccountRegisteredEvent } from '@root/integration-events/new-account-registered.event';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
  mailerService: MailerService;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = `identity.${NewAccountRegisteredEvent.name}`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    event: NewAccountRegisteredEvent,
    messageContext: MessageContext,
  ): Promise<void> {
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

    this.dependencies.logger.info(`Sending welcome email to ${event.payload.email}`);

    await this.dependencies.mailerService.sendMail({
      payload: {
        link: 'https://google.com',
        activationCode: '12345',
      },
      subject: 'Welcome to Krater!',
      template: 'welcome',
      to: event.payload.email,
    });

    span.finish();
  }
}
