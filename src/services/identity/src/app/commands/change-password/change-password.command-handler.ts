import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountRepository } from '@core/account/account.repository';
import { CommandHandler, MessageBus, UnauthorizedError } from '@krater/building-blocks';
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

  public async handle({
    payload: { accountId, context, newPassword, oldPassword },
  }: ChangePasswordCommand): Promise<void> {
    const { accountRepository, tracer, passwordHashProviderService, messageBus } =
      this.dependencies;

    const span = tracer.startSpan('[Command Handler] Change password command handler', {
      childOf: context,
    });

    const account = await accountRepository.findById(accountId);

    if (!account) {
      throw new UnauthorizedError();
    }

    await account.changePassword(oldPassword, newPassword, {
      passwordHashProviderService,
    });

    await accountRepository.update(account);

    const headers = {};

    tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);

    const eventPromises = account.getDomainEvents().map((event) =>
      messageBus.sendEvent(event, {
        spanContext: headers as SpanContext,
      }),
    );

    await Promise.all(eventPromises);

    span.finish();
  }
}
