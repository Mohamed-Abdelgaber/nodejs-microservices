import { Account } from '@core/account/account.aggregate-root';
import { AccountRepository } from '@core/account/account.repository';
import { AccountModel } from '@infrastructure/account-registration/account.model';

export class AccountRepositoryImpl implements AccountRepository {
  public async findByEmail(email: string): Promise<Account | null> {
    const result = await AccountModel.findOne({
      email,
    })
      .select(['id', 'email', 'password', 'status'])
      .exec();

    if (!result) {
      return null;
    }

    return Account.fromPersistence({
      id: result.id,
      email: result.email,
      status: result.status,
      passwordHash: result.password,
    });
  }

  public async findById(id: string): Promise<Account> {
    const result = await AccountModel.findOne({
      id,
    })
      .select(['id', 'email', 'password', 'status'])
      .exec();

    if (!result) {
      return null;
    }

    return Account.fromPersistence({
      id: result.id,
      email: result.email,
      status: result.status,
      passwordHash: result.password,
    });
  }

  public async update(account: Account): Promise<void> {
    await AccountModel.updateOne(
      {
        id: account.getId(),
      },
      {
        password: account.getPasswordHash(),
      },
    );
  }
}
