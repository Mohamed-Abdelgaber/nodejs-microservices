import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { AccountModel } from './account.model';

export class AccountRegistrationRepositoryImpl implements AccountRegistrationRepository {
  public async insert(accountRegistration: AccountRegistration): Promise<void> {
    const accountData = accountRegistration.toJSON();

    await AccountModel.create(accountData);
  }
}
