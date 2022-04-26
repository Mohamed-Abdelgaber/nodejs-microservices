import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';

export class AccountEmailCheckerServiceImpl implements AccountEmailCheckerService {
  public async isUnique(email: string): Promise<boolean> {
    // TODO: When DB will be connected, refactor to check persistence
    return true;
  }
}
