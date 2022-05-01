import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';
import { CommandHandler, MessageBus } from '@krater/building-blocks';
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

  public async handle({
    payload: { context, email },
  }: ResendEmailVerificationCodeCommand): Promise<void> {
    const {
      accountRegistrationRepository,
      messageBus,
      tracer,
      emailVerificationCodeProviderService,
    } = this.dependencies;

    const span = tracer.startSpan('[Command Handler] Resend Email Verification Code for account', {
      childOf: context,
    });

    span.addTags({
      'x-type': 'command',
    });

    const headers = {};

    tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);

    const accountRegistration = await accountRegistrationRepository.findByEmail(email);

    if (!accountRegistration) {
      span.finish();
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

    span.finish();
  }
}
