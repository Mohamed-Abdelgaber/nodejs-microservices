import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { NewPasswordHasBeenSetEvent } from '@root/integration-events/new-password-has-been-set.event';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
  mailerService: MailerService;
}

export class NewPasswordHasBeenSetSubscriber
  implements EventSubscriber<NewPasswordHasBeenSetEvent>
{
  public readonly type = `identity.${NewPasswordHasBeenSetEvent.name}.notifications`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    { payload: { email } }: NewPasswordHasBeenSetEvent,
    messageContext: MessageContext,
  ): Promise<void> {
    const { logger, mailerService, tracer } = this.dependencies;

    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, messageContext.spanContext);

    const span = tracer.startSpan(
      '[Subscriber] Send email notification to user which updates his password.',
      {
        childOf: ctx,
      },
    );

    span.addTags({
      'x-type': 'subscriber',
    });

    logger.info(`Sending email to user (${email}) which updates his password.`);

    await mailerService.sendMail({
      payload: {
        profileUrl: 'http://google.com',
      },
      subject: 'Password updated successfully',
      template: 'new-password',
      to: email,
    });

    span.finish();
  }
}
