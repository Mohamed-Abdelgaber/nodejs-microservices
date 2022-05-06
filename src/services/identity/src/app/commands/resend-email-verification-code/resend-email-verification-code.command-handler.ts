import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';
import { CommandHandler, CommandHandlerContext, MessageBus } from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import { ResendEmailVerificationCodeCommand } from './resend-email-verification-code.command';

interface Dependencies {
  tracer: Tracer;
  accountRegistrationRepository: AccountRegistrationRepository;
  messageBus: MessageBus;
  emailVerificationCodeProviderService: EmailVerificationCodeProviderService;
}

export class ResendEmailVerificationCodeCommandHandler
  implements CommandHandler<ResendEmailVerificationCodeCommand>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    { payload: { email } }: ResendEmailVerificationCodeCommand,
    { spanContext }: CommandHandlerContext,
  ): Promise<void> {
    const {
      accountRegistrationRepository,
      messageBus,
      tracer,
      emailVerificationCodeProviderService,
    } = this.dependencies;
    const headers = {};

    tracer.inject(spanContext, FORMAT_HTTP_HEADERS, headers);

    const accountRegistration = await accountRegistrationRepository.findByEmail(email);

    if (!accountRegistration) {
      return;
    }

    accountRegistration.resendEmailVerificationCode(emailVerificationCodeProviderService);

    await accountRegistrationRepository.update(accountRegistration);

    const eventPromises = accountRegistration.getDomainEvents().map((event) =>
      messageBus.sendEvent(event, {
        spanContext: headers as SpanContext,
      }),
    );

    await Promise.all(eventPromises);
  }
}
