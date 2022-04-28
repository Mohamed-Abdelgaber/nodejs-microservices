import { EmailVerificationCodeStatus } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { Entity, UniqueEntityID } from '@krater/building-blocks';
import { EmailVerificationCodeProviderService } from './email-verification-code-provider.service';
import { VerificationCodeMustNotBeUsedAlreadyRule } from './rules/verification-code-must-not-be-used-already.rule';

interface EmailVerificationCodeProps {
  code: string;
  status: EmailVerificationCodeStatus;
  generatedAt: Date;
}

export interface PersistedEmailVerificationCode {
  id: string;
  code: string;
  status: string;
  generatedAt: Date;
}

interface Dependencies {
  emailVerificationCodeProviderService: EmailVerificationCodeProviderService;
}

export class EmailVerificationCode extends Entity<EmailVerificationCodeProps> {
  private constructor(props: EmailVerificationCodeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ emailVerificationCodeProviderService }: Dependencies) {
    return new EmailVerificationCode({
      code: emailVerificationCodeProviderService.generateVerificationCode(6),
      status: EmailVerificationCodeStatus.Active,
      generatedAt: new Date(),
    });
  }

  public static fromPersistence({ id, code, generatedAt, status }: PersistedEmailVerificationCode) {
    return new EmailVerificationCode(
      { code, generatedAt, status: EmailVerificationCodeStatus.fromValue(status) },
      new UniqueEntityID(id),
    );
  }

  public confirm() {
    EmailVerificationCode.checkRule(
      new VerificationCodeMustNotBeUsedAlreadyRule(this.props.status),
    );

    this.props.status = EmailVerificationCodeStatus.Used;
  }

  public archive() {
    this.props.status = EmailVerificationCodeStatus.Archived;
  }

  public getCode() {
    return this.props.code;
  }

  public isActive() {
    return this.props.status.equals(EmailVerificationCodeStatus.Active);
  }

  public getId() {
    return this.id;
  }

  public toJSON() {
    return {
      id: this.id.value,
      code: this.props.code,
      generatedAt: this.props.generatedAt,
      status: this.props.status.getValue(),
    };
  }
}
