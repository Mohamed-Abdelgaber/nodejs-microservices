import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountRepository } from '@core/account/account.repository';
import {
  CommandHandler,
  MessageBus,
  UnauthorizedError,
  CommandHandlerContext,
} from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import { ChangePasswordCommand } from './change-password.command';

interface Dependencies {
  accountRepository: AccountRepository;
  tracer: Tracer;
  passwordHashProviderService: PasswordHashProviderService;
  messageBus: MessageBus;
}

export class ChangePasswordCommandHandler implements CommandHandler<ChangePasswordCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    { payload: { accountId, newPassword, oldPassword } }: ChangePasswordCommand,
    { spanContext }: CommandHandlerContext,
  ): Promise<void> {
    const { accountRepository, tracer, passwordHashProviderService, messageBus } =
      this.dependencies;

    const account = await accountRepository.findById(accountId);

    if (!account) {
      throw new UnauthorizedError();
    }

    await account.changePassword(oldPassword, newPassword, {
      passwordHashProviderService,
    });

    await accountRepository.update(account);

    const headers = {};

    tracer.inject(spanContext, FORMAT_HTTP_HEADERS, headers);

    const eventPromises = account.getDomainEvents().map((event) =>
      messageBus.sendEvent(event, {
        spanContext: headers as SpanContext,
      }),
    );

    await Promise.all(eventPromises);
  }
}
