import { EmailVerificationCodeStatusNotSupportedError } from '@core/errors/email-verification-code-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum EmailVerificationCodeStatusValue {
  Active = 'Active',
  Archived = 'Archived',
  Used = 'Used',
}

interface EmailVerificationCodeStatusProps {
  value: string;
}

export class EmailVerificationCodeStatus extends ValueObject<EmailVerificationCodeStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Active = new EmailVerificationCodeStatus(EmailVerificationCodeStatusValue.Active);

  public static Archived = new EmailVerificationCodeStatus(
    EmailVerificationCodeStatusValue.Archived,
  );

  public static Used = new EmailVerificationCodeStatus(EmailVerificationCodeStatusValue.Used);

  public static fromValue(value: string) {
    switch (value) {
      case EmailVerificationCodeStatusValue.Active:
        return this.Active;

      case EmailVerificationCodeStatusValue.Archived:
        return this.Archived;

      case EmailVerificationCodeStatusValue.Used:
        return this.Used;

      default:
        throw new EmailVerificationCodeStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
