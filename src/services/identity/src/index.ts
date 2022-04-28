import { config } from 'dotenv';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { PasswordHashProviderServiceImpl } from '@infrastructure/password-hash-provider/password-hash-provider.service';
import { AccountEmailCheckerServiceImpl } from '@infrastructure/account-email-checker/account-email-checker.service';
import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { IdentityController } from '@api/identity.controller';
import { AccountRegistrationRepositoryImpl } from '@infrastructure/account-registration/account-registration.repository';
import { EmailVerificationCodeProviderServiceImpl } from '@infrastructure/email-verification-code/email-verification-code-provider.service';
import { VerifyEmailAddressCommandHandler } from '@app/commands/verify-email-address/verify-email-address.command-handler';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('identity')
    .useRabbitMQ('amqp://localhost')
    .useConsul('http://localhost:8500')
    .useMongo('mongodb://localhost:27017/identity')
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([
      asClass(RegisterNewAccountCommandHandler).singleton(),
      asClass(VerifyEmailAddressCommandHandler).singleton(),
    ])
    .setControllers([asClass(IdentityController).singleton()])
    .setEventSubscribers([])
    .setQueryHandlers([])
    .setCustom({
      passwordHashProviderService: asClass(PasswordHashProviderServiceImpl).singleton(),
      accountEmailCheckerService: asClass(AccountEmailCheckerServiceImpl).singleton(),
      accountRegistrationRepository: asClass(AccountRegistrationRepositoryImpl).singleton(),
      emailVerificationCodeProviderService: asClass(
        EmailVerificationCodeProviderServiceImpl,
      ).singleton(),
    })
    .build();

  await service.bootstrap();

  const port = Number(process.env.APP_PORT) ?? 4000;

  service.listen(port);
})();
