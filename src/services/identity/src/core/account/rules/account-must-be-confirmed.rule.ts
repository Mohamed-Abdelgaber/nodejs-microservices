import { AccountStatus } from '@core/account-status/account-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class AccountMustBeConfirmedRule implements BusinessRule {
  public readonly message = 'To log in account email address must be confirmed.';

  constructor(private readonly status: AccountStatus) {}

  public isBroken(): boolean {
    return !this.status.equals(AccountStatus.EmailConfirmed);
  }
}
