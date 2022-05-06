import { Command } from '@krater/building-blocks';

export interface SignInCommandPayload {
  email: string;
  password: string;
}

export class SignInCommand implements Command<SignInCommandPayload> {
  constructor(public readonly payload: SignInCommandPayload) {}
}
