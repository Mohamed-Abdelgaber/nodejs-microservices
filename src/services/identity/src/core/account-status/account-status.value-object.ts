import { AccountStatusNotSupportedError } from '@core/errors/account-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum AccountStatusValue {
  WaitingForEmailConfirmation = 'WaitingForEmailConfirmation',
  EmailConfirmed = 'EmailConfirmed',
  Expired = 'Expired',
}

interface AccountStatusProps {
  value: string;
}

export class AccountStatus extends ValueObject<AccountStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static WaitingForEmailConfirmation = new AccountStatus(
    AccountStatusValue.WaitingForEmailConfirmation,
  );

  public static EmailConfirmed = new AccountStatus(AccountStatusValue.EmailConfirmed);

  public static Expired = new AccountStatus(AccountStatusValue.Expired);

  public static fromValue(value: string) {
    switch (value) {
      case AccountStatusValue.WaitingForEmailConfirmation:
        return this.WaitingForEmailConfirmation;

      case AccountStatusValue.EmailConfirmed:
        return this.EmailConfirmed;

      case AccountStatusValue.Expired:
        return this.Expired;

      default:
        throw new AccountStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
