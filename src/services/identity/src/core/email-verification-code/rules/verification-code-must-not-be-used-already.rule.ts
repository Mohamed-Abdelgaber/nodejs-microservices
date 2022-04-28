import { EmailVerificationCodeStatus } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class VerificationCodeMustNotBeUsedAlreadyRule implements BusinessRule {
  public readonly message = 'Selected Email Verification Code is already used.';

  constructor(private readonly status: EmailVerificationCodeStatus) {}

  public isBroken(): boolean {
    return this.status.equals(EmailVerificationCodeStatus.Used);
  }
}
