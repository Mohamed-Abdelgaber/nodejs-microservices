import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountModel } from '@infrastructure/account-registration/account.model';

export class AccountEmailCheckerServiceImpl implements AccountEmailCheckerService {
  public async isUnique(email: string): Promise<boolean> {
    const result = await AccountModel.find({
      email,
    }).exec();

    return result.length === 0;
  }
}
