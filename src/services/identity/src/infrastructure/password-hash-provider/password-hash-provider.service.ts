import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import bcrypt from 'bcrypt';

export class PasswordHashProviderServiceImpl implements PasswordHashProviderService {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
