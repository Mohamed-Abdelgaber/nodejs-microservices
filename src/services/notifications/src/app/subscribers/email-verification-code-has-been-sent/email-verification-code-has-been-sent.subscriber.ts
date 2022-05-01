import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber, Logger, MessageContext } from '@krater/building-blocks';
import { EmailVerificationCodeHasBeenSentAgainEvent } from '@root/integration-events/email-verification-code-has-been-sent-again.event';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  logger: Logger;
  tracer: Tracer;
  mailerService: MailerService;
}

export class EmailVerificationCodeHasBeenSentAgainSubscriber
  implements EventSubscriber<EmailVerificationCodeHasBeenSentAgainEvent>
{
  public readonly type = `identity.${EmailVerificationCodeHasBeenSentAgainEvent.name}.notifications`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    { payload: { email, verificationCode } }: EmailVerificationCodeHasBeenSentAgainEvent,
    messageContext: MessageContext,
  ): Promise<void> {
    const { logger, mailerService, tracer } = this.dependencies;

    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, messageContext.spanContext);

    const span = tracer.startSpan(
      '[Subscriber] Resend email notification with new email verification code',
      {
        childOf: ctx,
      },
    );

    span.addTags({
      'x-type': 'subscriber',
    });

    logger.info(`Sending email with new email verification code to ${email}`);

    await mailerService.sendMail({
      payload: {
        link: 'https://google.com',
        activationCode: verificationCode,
      },
      subject: 'New Email Verification Code',
      template: 'welcome',
      to: email,
    });

    span.finish();
  }
}
