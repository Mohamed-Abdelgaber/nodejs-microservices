import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber, Logger } from '@krater/building-blocks';
import { EmailVerificationCodeHasBeenSentAgainEvent } from '@root/integration-events/email-verification-code-has-been-sent-again.event';

interface Dependencies {
  logger: Logger;
  mailerService: MailerService;
}

export class EmailVerificationCodeHasBeenSentAgainSubscriber
  implements EventSubscriber<EmailVerificationCodeHasBeenSentAgainEvent>
{
  public readonly type = `identity.${EmailVerificationCodeHasBeenSentAgainEvent.name}.notifications`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { email, verificationCode },
  }: EmailVerificationCodeHasBeenSentAgainEvent): Promise<void> {
    const { logger, mailerService } = this.dependencies;

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
  }
}
