import {
  ChangePasswordCommand,
  ChangePasswordCommandPayload,
} from '@app/commands/change-password/change-password.command';
import { RegisterNewAccountCommand } from '@app/commands/register-new-account/register-new-account.command';
import { ResendEmailVerificationCodeCommand } from '@app/commands/resend-email-verification-code/resend-email-verification-code.command';
import { SignInCommand, SignInCommandPayload } from '@app/commands/sign-in/sign-in.command';
import { VerifyEmailAddressCommand } from '@app/commands/verify-email-address/verify-email-address.command';
import { RegisterNewAccountPayload } from '@core/account-registration/account-registration.aggregate-root';
import { CommandBus, ServiceClient, ServiceController } from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  serviceClient: ServiceClient;
  commandBus: CommandBus;
  tracer: Tracer;
}

interface VerifyEmailMessage {
  email: string;
  verificationCode: string;
}

interface ResendEmailVerificationCodeMessage {
  email: string;
}

export class IdentityServiceController implements ServiceController {
  constructor(private readonly dependencies: Dependencies) {}

  public async setup(): Promise<void> {
    await Promise.all([
      this.handleSignUp(),
      this.handleVerifyEmail(),
      this.handleResendEmailVerificationCode(),
      this.handleSignIn(),
      this.handleChangePassword(),
    ]);
  }

  private async handleSignUp() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<RegisterNewAccountPayload>(
      'identity.sign_up',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(new RegisterNewAccountCommand({ ...data }), {
          context,
        });
      },
    );
  }

  private async handleVerifyEmail() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<VerifyEmailMessage>(
      'identity.verify_email_address',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(new VerifyEmailAddressCommand({ ...data }), {
          context,
        });
      },
    );
  }

  public async handleResendEmailVerificationCode() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<ResendEmailVerificationCodeMessage>(
      'identity.resend_email_verification_code',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(
          new ResendEmailVerificationCodeCommand({
            ...data,
          }),
          {
            context,
          },
        );
      },
    );
  }

  private async handleSignIn() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<SignInCommandPayload>(
      'identity.sign_in',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(
          new SignInCommand({
            ...data,
          }),
          {
            context,
          },
        );
      },
    );
  }

  private async handleChangePassword() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<ChangePasswordCommandPayload>(
      'identity.change_password',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(
          new ChangePasswordCommand({
            ...data,
          }),
          {
            context,
          },
        );
      },
    );
  }
}
