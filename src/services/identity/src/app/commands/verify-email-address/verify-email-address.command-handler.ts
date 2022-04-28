import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { CommandHandler, UnauthorizedError } from '@krater/building-blocks';
import { Tracer } from 'opentracing';
import { VerifyEmailAddressCommand } from './verify-email-address.command';

interface Dependencies {
  tracer: Tracer;
  accountRegistrationRepository: AccountRegistrationRepository;
}

export class VerifyEmailAddressCommandHandler implements CommandHandler<VerifyEmailAddressCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { context, email, verificationCode },
  }: VerifyEmailAddressCommand): Promise<void> {
    const { accountRegistrationRepository, tracer } = this.dependencies;

    const span = tracer.startSpan('[Command] Verify Email address for account', {
      childOf: context,
    });

    span.addTags({
      'x-type': 'command',
    });

    const accountRegistration = await accountRegistrationRepository.findByEmail(email);

    if (!email) {
      throw new UnauthorizedError();
    }

    accountRegistration.confirmEmail(verificationCode);

    span.finish();
  }
}
