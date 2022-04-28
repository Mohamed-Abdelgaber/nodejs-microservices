import { AccountStatus } from '@core/account-status/account-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class EmailMustNotBeConfirmedAlreadyRule implements BusinessRule {
  public readonly message = 'Your email is already confirmed.';

  constructor(private readonly status: AccountStatus) {}

  public isBroken(): boolean {
    return this.status.equals(AccountStatus.EmailConfirmed);
  }
}
