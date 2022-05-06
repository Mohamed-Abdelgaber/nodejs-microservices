import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber, Logger } from '@krater/building-blocks';
import { NewPasswordHasBeenSetEvent } from '@root/integration-events/new-password-has-been-set.event';

interface Dependencies {
  logger: Logger;
  mailerService: MailerService;
}

export class NewPasswordHasBeenSetSubscriber
  implements EventSubscriber<NewPasswordHasBeenSetEvent>
{
  public readonly type = `identity.${NewPasswordHasBeenSetEvent.name}.notifications`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload: { email } }: NewPasswordHasBeenSetEvent): Promise<void> {
    const { logger, mailerService } = this.dependencies;

    logger.info(`Sending email to user (${email}) which updates his password.`);

    await mailerService.sendMail({
      payload: {
        profileUrl: 'http://google.com',
      },
      subject: 'Password updated successfully',
      template: 'new-password',
      to: email,
    });
  }
}
