import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { AccountModel } from './account.model';

export class AccountRegistrationRepositoryImpl implements AccountRegistrationRepository {
  public async insert(accountRegistration: AccountRegistration): Promise<void> {
    await AccountModel.create(accountRegistration.toJSON());
  }
}
