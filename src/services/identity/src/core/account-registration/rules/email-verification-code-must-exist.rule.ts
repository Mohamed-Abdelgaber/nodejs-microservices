import { EmailVerificationCode } from '@core/email-verification-code/email-verification-code.entity';
import { BusinessRule } from '@krater/building-blocks';

export class EmailVerificationCodeMustExistRule implements BusinessRule {
  public readonly message = 'Provided Email Verification Code is invalid.';

  constructor(
    private readonly verificationCode: string,
    private readonly emailVerificationCodes: EmailVerificationCode[],
  ) {}

  public isBroken(): boolean {
    const existingVerificationCode = this.emailVerificationCodes.find(
      (code) => code.getCode() === this.verificationCode,
    );

    if (!existingVerificationCode) {
      return true;
    }

    return !existingVerificationCode.isActive();
  }
}
