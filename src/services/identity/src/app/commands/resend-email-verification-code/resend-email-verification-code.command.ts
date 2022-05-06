import { Command } from '@krater/building-blocks';

interface Payload {
  email: string;
}

export class ResendEmailVerificationCodeCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
