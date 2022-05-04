import { Account } from './account.aggregate-root';

export interface AccountRepository {
  findByEmail(email: string): Promise<Account | null>;

  findById(id: string): Promise<Account | null>;

  update(account: Account): Promise<void>;
}
