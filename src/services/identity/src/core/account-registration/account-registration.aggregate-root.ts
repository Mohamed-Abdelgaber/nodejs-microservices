import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountEmail } from '@core/account-email/account-email.value-object';
import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/account-status/account-status.value-object';
import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';
import {
  EmailVerificationCode,
  PersistedEmailVerificationCode,
} from '@core/email-verification-code/email-verification-code.entity';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { AccountEmailConfirmedEvent } from './events/account-email-confirmed.event';
import { EmailVerificationCodeHasBeenSentAgainEvent } from './events/email-verification-code-has-been-sent-again.event';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';
import { EmailMustNotBeConfirmedAlreadyRule } from './rules/email-must-not-be-confirmed-already.rule';
import { EmailVerificationCodeMustExistRule } from './rules/email-verification-code-must-exist.rule';

interface AccountRegistrationProps {
  email: AccountEmail;
  password: AccountPassword;
  status: AccountStatus;
  registeredAt: Date;
  emailConfirmedAt: Date | null;
  emailVerificationCodes: EmailVerificationCode[];
}

export interface RegisterNewAccountPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
}

interface PersistedAccountRegistration {
  id: string;
  email: string;
  passwordHash: string;
  status: string;
  registeredAt: Date;
  emailConfirmedAt: Date | null;
  emailVerificationCodes: PersistedEmailVerificationCode[];
}

interface Dependencies {
  accountEmailCheckerService: AccountEmailCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
  emailVerificationCodeProviderService: EmailVerificationCodeProviderService;
}

export class AccountRegistration extends AggregateRoot<AccountRegistrationProps> {
  private constructor(props: AccountRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNew(
    { email, password, ...contactDetails }: RegisterNewAccountPayload,
    {
      accountEmailCheckerService,
      passwordHashProviderService,
      emailVerificationCodeProviderService,
    }: Dependencies,
  ) {
    const verificationCode = EmailVerificationCode.createNew({
      emailVerificationCodeProviderService,
    });

    const accountRegistration = new AccountRegistration({
      password: await AccountPassword.createNew(password, {
        passwordHashProviderService,
      }),
      email: await AccountEmail.createNew(email, { accountEmailCheckerService }),
      emailConfirmedAt: null,
      registeredAt: new Date(),
      status: AccountStatus.WaitingForEmailConfirmation,
      emailVerificationCodes: [verificationCode],
    });

    accountRegistration.addDomainEvent(
      new NewAccountRegisteredEvent({
        ...contactDetails,
        accountId: accountRegistration.id.value,
        email,
        verificationCode: verificationCode.getCode(),
      }),
    );

    return accountRegistration;
  }

  public static fromPersistence({
    id,
    email,
    emailConfirmedAt,
    emailVerificationCodes,
    passwordHash,
    registeredAt,
    status,
  }: PersistedAccountRegistration) {
    return new AccountRegistration(
      {
        registeredAt,
        email: AccountEmail.fromPersistence(email),
        password: AccountPassword.fromPersistence(passwordHash),
        status: AccountStatus.fromValue(status),
        emailConfirmedAt: emailConfirmedAt ?? null,
        emailVerificationCodes: emailVerificationCodes.map(EmailVerificationCode.fromPersistence),
      },
      new UniqueEntityID(id),
    );
  }

  public confirmEmail(verificationCode: string) {
    AccountRegistration.checkRule(new EmailMustNotBeConfirmedAlreadyRule(this.props.status));
    AccountRegistration.checkRule(
      new EmailVerificationCodeMustExistRule(verificationCode, this.props.emailVerificationCodes),
    );

    const existingVerificationCode = this.props.emailVerificationCodes.find(
      (code) => code.getCode() === verificationCode,
    );

    existingVerificationCode.confirm();

    this.props.emailVerificationCodes = this.props.emailVerificationCodes.map((code) => {
      if (code.getId().equals(existingVerificationCode.getId())) {
        return code;
      }

      code.archive();

      return code;
    });

    const now = new Date();

    this.props.emailConfirmedAt = now;
    this.props.status = AccountStatus.EmailConfirmed;

    this.addDomainEvent(
      new AccountEmailConfirmedEvent({
        accountId: this.id.value,
        activatedAt: now.toISOString(),
      }),
    );
  }

  public resendEmailVerificationCode(
    emailVerificationCodeProviderService: EmailVerificationCodeProviderService,
  ) {
    const newEmailVerificationCode = EmailVerificationCode.createNew({
      emailVerificationCodeProviderService,
    });

    this.props.emailVerificationCodes = this.props.emailVerificationCodes.map((code) => {
      code.archive();

      return code;
    });

    this.props.emailVerificationCodes.push(newEmailVerificationCode);

    this.addDomainEvent(
      new EmailVerificationCodeHasBeenSentAgainEvent({
        accountId: this.id.value,
        email: this.props.email.toString(),
        verificationCode: newEmailVerificationCode.getCode(),
      }),
    );
  }

  public getEmailVerificationCodes() {
    return this.props.emailVerificationCodes;
  }

  public toJSON() {
    return {
      id: this.id.value,
      email: this.props.email.toString(),
      password: this.props.password.getHash(),
      registeredAt: this.props.registeredAt,
      emailConfirmedAt: this.props.emailConfirmedAt,
      status: this.props.status.getValue(),
    };
  }
}
