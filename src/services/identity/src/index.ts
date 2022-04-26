import { config } from 'dotenv';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { PasswordHashProviderServiceImpl } from '@infrastructure/password-hash-provider/password-hash-provider.service';
import { AccountEmailCheckerServiceImpl } from '@infrastructure/account-email-checker/account-email-checker.service';
import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { IdentityController } from '@api/identity.controller';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('identity')
    .useRabbitMQ('amqp://localhost')
    .useConsul('http://localhost:8500')
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([asClass(RegisterNewAccountCommandHandler).singleton()])
    .setControllers([asClass(IdentityController).singleton()])
    .setEventSubscribers([])
    .setQueryHandlers([])
    .setCustom({
      passwordHashProviderService: asClass(PasswordHashProviderServiceImpl).singleton(),
      accountEmailCheckerService: asClass(AccountEmailCheckerServiceImpl).singleton(),
    })
    .build();

  await service.bootstrap();

  const port = Number(process.env.APP_PORT) ?? 4000;

  service.listen(port);
})();
