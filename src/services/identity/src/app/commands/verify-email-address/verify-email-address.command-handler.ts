import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import {
  CommandHandler,
  CommandHandlerContext,
  MessageBus,
  UnauthorizedError,
} from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import { VerifyEmailAddressCommand } from './verify-email-address.command';

interface Dependencies {
  tracer: Tracer;
  accountRegistrationRepository: AccountRegistrationRepository;
  messageBus: MessageBus;
}

export class VerifyEmailAddressCommandHandler implements CommandHandler<VerifyEmailAddressCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    { payload: { email, verificationCode } }: VerifyEmailAddressCommand,
    { spanContext }: CommandHandlerContext,
  ): Promise<void> {
    const { accountRegistrationRepository, tracer, messageBus } = this.dependencies;

    const headers = {};

    tracer.inject(spanContext, FORMAT_HTTP_HEADERS, headers);

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
  }
}
