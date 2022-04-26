import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountEmail } from '@core/account-email/account-email.value-object';
import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/account-status/account-status.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';

interface AccountRegistrationProps {
  email: AccountEmail;
  password: AccountPassword;
  status: AccountStatus;
  registeredAt: Date;
  emailConfirmedAt: Date | null;
}

export interface RegisterNewAccountPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
}

interface Dependencies {
  accountEmailCheckerService: AccountEmailCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
}

export class AccountRegistration extends AggregateRoot<AccountRegistrationProps> {
  private constructor(props: AccountRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNew(
    { email, password, ...contactDetails }: RegisterNewAccountPayload,
    { accountEmailCheckerService, passwordHashProviderService }: Dependencies,
  ) {
    const accountRegistration = new AccountRegistration({
      password: await AccountPassword.createNew(password, {
        passwordHashProviderService,
      }),
      email: await AccountEmail.createNew(email, { accountEmailCheckerService }),
      emailConfirmedAt: null,
      registeredAt: new Date(),
      status: AccountStatus.WaitingForEmailConfirmation,
    });

    accountRegistration.addDomainEvent(new NewAccountRegisteredEvent({ ...contactDetails, email }));

    return accountRegistration;
  }
}
