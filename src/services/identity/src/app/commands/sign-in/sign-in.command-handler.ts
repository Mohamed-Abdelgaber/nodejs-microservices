import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountRepository } from '@core/account/account.repository';
import { CommandHandler, TokenProviderService, UnauthorizedError } from '@krater/building-blocks';
import { Tracer } from 'opentracing';
import { SignInCommand } from './sign-in.command';

export interface SignInCommandResult {
  token: string;
}

interface Dependencies {
  tokenProviderService: TokenProviderService;
  accountRepository: AccountRepository;
  tracer: Tracer;
  passwordHashProviderService: PasswordHashProviderService;
}

export class SignInCommandHandler implements CommandHandler<SignInCommand, SignInCommandResult> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { email, password, context },
  }: SignInCommand): Promise<SignInCommandResult> {
    const { accountRepository, tokenProviderService, tracer, passwordHashProviderService } =
      this.dependencies;

    const span = tracer.startSpan('[Command Handler] Sign In command handler', {
      childOf: context,
    });

    span.addTags({
      'x-type': 'command',
    });

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

    span.finish();

    return {
      token,
    };
  }
}
