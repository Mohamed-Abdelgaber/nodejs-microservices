import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { CommandHandler, MessageBus } from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import { RegisterNewAccountCommand } from './register-new-account.command';

interface Dependencies {
  accountEmailCheckerService: AccountEmailCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
  messageBus: MessageBus;
  tracer: Tracer;
  accountRegistrationRepository: AccountRegistrationRepository;
}

export class RegisterNewAccountCommandHandler implements CommandHandler<RegisterNewAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { context, ...payload },
  }: RegisterNewAccountCommand): Promise<void> {
    const span = this.dependencies.tracer.startSpan(
      '[Command] Register new account command handler',
      {
        childOf: context,
      },
    );

    span.addTags({
      'x-type': 'command',
    });

    const headers = {};

    this.dependencies.tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);

    const { accountEmailCheckerService, passwordHashProviderService, messageBus } =
      this.dependencies;

    const accountRegistration = await AccountRegistration.registerNew(payload, {
      accountEmailCheckerService,
      passwordHashProviderService,
    });

    const eventPromises = accountRegistration.getDomainEvents().map((event) =>
      messageBus.sendEvent(event, {
        spanContext: headers as SpanContext,
      }),
    );

    await this.dependencies.accountRegistrationRepository.insert(accountRegistration);

    await Promise.all(eventPromises);

    span.finish();
  }
}
