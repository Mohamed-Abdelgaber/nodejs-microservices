import { Command } from '@krater/building-blocks';

interface Payload {
  email: string;
  verificationCode: string;
}

export class VerifyEmailAddressCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
