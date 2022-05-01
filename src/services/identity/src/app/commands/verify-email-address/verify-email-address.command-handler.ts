import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { CommandHandler, MessageBus, UnauthorizedError } from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import { VerifyEmailAddressCommand } from './verify-email-address.command';

interface Dependencies {
  tracer: Tracer;
  accountRegistrationRepository: AccountRegistrationRepository;
  messageBus: MessageBus;
}

export class VerifyEmailAddressCommandHandler implements CommandHandler<VerifyEmailAddressCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { context, email, verificationCode },
  }: VerifyEmailAddressCommand): Promise<void> {
    const { accountRegistrationRepository, tracer, messageBus } = this.dependencies;

    const span = tracer.startSpan('[Command Handler] Verify Email address for account', {
      childOf: context,
    });

    span.addTags({
      'x-type': 'command',
    });

    const headers = {};

    this.dependencies.tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);

    const accountRegistration = await accountRegistrationRepository.findByEmail(email);

    if (!accountRegistration) {
      throw new UnauthorizedError();
    }

    accountRegistration.confirmEmail(verificationCode);

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
