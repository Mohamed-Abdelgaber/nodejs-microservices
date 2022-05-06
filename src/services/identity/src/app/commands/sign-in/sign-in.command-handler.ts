import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountRepository } from '@core/account/account.repository';
import { CommandHandler, TokenProviderService, UnauthorizedError } from '@krater/building-blocks';
import { SignInCommand } from './sign-in.command';

export interface SignInCommandResult {
  token: string;
}

interface Dependencies {
  tokenProviderService: TokenProviderService;
  accountRepository: AccountRepository;
  passwordHashProviderService: PasswordHashProviderService;
}

export class SignInCommandHandler implements CommandHandler<SignInCommand, SignInCommandResult> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { email, password },
  }: SignInCommand): Promise<SignInCommandResult> {
    const { accountRepository, tokenProviderService, passwordHashProviderService } =
      this.dependencies;

    const account = await accountRepository.findByEmail(email);

    if (!account) {
      throw new UnauthorizedError();
    }

    await account.login(password, {
      passwordHashProviderService,
    });

    const token = tokenProviderService.generateToken(
      {
        accountId: account.getId(),
      },
      '1h',
      'secret',
    );

    return {
      token: `Bearer ${token}`,
    };
  }
}
