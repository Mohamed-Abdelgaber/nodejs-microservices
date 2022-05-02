import { AccountEmail } from '@core/account-email/account-email.value-object';
import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/account-status/account-status.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { AccountMustBeConfirmedRule } from './rules/account-must-be-confirmed.rule';
import { PasswordMustBeValidRule } from './rules/password-must-be-valid.rule';

interface AccountProps {
  email: AccountEmail;
  password: AccountPassword;
  status: AccountStatus;
}

export interface PersistedAccount {
  id: string;
  email: string;
  passwordHash: string;
  status: string;
}

interface Dependencies {
  passwordHashProviderService: PasswordHashProviderService;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id, email, passwordHash, status }: PersistedAccount) {
    return new Account(
      {
        email: AccountEmail.fromPersistence(email),
        password: AccountPassword.fromPersistence(passwordHash),
        status: AccountStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public async login(password: string, { passwordHashProviderService }: Dependencies) {
    Account.checkRule(new AccountMustBeConfirmedRule(this.props.status));
    await Account.checkRule(
      new PasswordMustBeValidRule(this.props.password, password, passwordHashProviderService),
    );
  }
}
