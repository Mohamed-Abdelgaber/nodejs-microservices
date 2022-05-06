import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { EmailVerificationCodeStatusValue } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { EmailVerificationCodeModel } from '@infrastructure/email-verification-code/email-verification-code.model';
import { AccountModel } from './account.model';

export class AccountRegistrationRepositoryImpl implements AccountRegistrationRepository {
  public async insert(accountRegistration: AccountRegistration): Promise<void> {
    const rawEmailVerificationCodes = accountRegistration
      .getEmailVerificationCodes()
      .map((code) => code.toJSON());

    const emailVerificationCodes = (
      await EmailVerificationCodeModel.insertMany(rawEmailVerificationCodes)
    ).map(({ _id }) => _id);

    await AccountModel.create({ ...accountRegistration.toJSON(), emailVerificationCodes });
  }

  public async findByEmail(email: string) {
    const result = await AccountModel.findOne({
      email: email.toLowerCase(),
    });

    const emailVerificationCodes = await EmailVerificationCodeModel.find({
      _id: {
        $in: result.emailVerificationCodes,
      },
    });

    if (!result) {
      return null;
    }

    return AccountRegistration.fromPersistence({
      ...result.toJSON(),
      emailVerificationCodes,
    });
  }

  public async update(accountRegistration: AccountRegistration): Promise<void> {
    const { id, ...data } = accountRegistration.toJSON();

    const rawEmailVerificationCodes = accountRegistration
      .getEmailVerificationCodes()
      .map((code) => code.toJSON());

    await AccountModel.findOneAndUpdate(
      {
        id,
      },
      {
        $set: data,
      },
    );

    const newCode = rawEmailVerificationCodes.find(
      (code) => code.status === EmailVerificationCodeStatusValue.Active,
    );

    if (newCode) {
      const { _id } = await EmailVerificationCodeModel.create(newCode);

      await AccountModel.updateOne(
        { id },
        {
          $addToSet: {
            emailVerificationCodes: _id,
          },
        },
      );
    }

    const verificationCodePromises = rawEmailVerificationCodes.map(({ id: codeId, ...code }) =>
      EmailVerificationCodeModel.updateOne(
        {
          id: codeId,
        },
        {
          $set: code,
        },
      ),
    );

    await Promise.all(verificationCodePromises);
  }
}
