import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber, Logger } from '@krater/building-blocks';
import { NewAccountRegisteredEvent } from '@root/integration-events/new-account-registered.event';

interface Dependencies {
  logger: Logger;
  mailerService: MailerService;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = `identity.${NewAccountRegisteredEvent.name}.notifications`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: NewAccountRegisteredEvent): Promise<void> {
    this.dependencies.logger.info(`Sending welcome email to ${event.payload.email}`);

    await this.dependencies.mailerService.sendMail({
      payload: {
        link: 'https://google.com',
        activationCode: event.payload.verificationCode,
      },
      subject: 'Welcome to Krater!',
      template: 'welcome',
      to: event.payload.email,
    });
  }
}
