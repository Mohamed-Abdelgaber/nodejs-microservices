import { ValueObject } from '@krater/building-blocks';
import { AccountEmailCheckerService } from './account-email-checker.service';
import { EmailFormatMustBeValidRule } from './rules/email-format-must-be-valid.rule';
import { EmailMustBeUniqueRule } from './rules/email-must-be-unique.rule';

interface AccountEmailProps {
  localPart: string;
  domain: string;
}

interface Dependencies {
  accountEmailCheckerService: AccountEmailCheckerService;
}

export class AccountEmail extends ValueObject<AccountEmailProps> {
  private constructor(props: AccountEmailProps) {
    super(props);
  }

  public static async createNew(email: string, { accountEmailCheckerService }: Dependencies) {
    AccountEmail.checkRule(new EmailFormatMustBeValidRule(email));
    await AccountEmail.checkRule(new EmailMustBeUniqueRule(email, accountEmailCheckerService));

    return this.convertEmailToParts(email);
  }

  public static fromPersistence(email: string) {
    return this.convertEmailToParts(email);
  }

  private static convertEmailToParts(email: string) {
    const [localPart, domain] = email.split('@');

    return new AccountEmail({
      localPart,
      domain,
    });
  }

  public toString() {
    return `${this.props.localPart}@${this.props.domain}`;
  }
}
