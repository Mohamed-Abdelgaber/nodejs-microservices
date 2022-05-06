import { Command } from '@krater/building-blocks';
import { RegisterNewAccountPayload } from '@core/account-registration/account-registration.aggregate-root';

export class RegisterNewAccountCommand implements Command<RegisterNewAccountPayload> {
  constructor(public readonly payload: RegisterNewAccountPayload) {}
}
