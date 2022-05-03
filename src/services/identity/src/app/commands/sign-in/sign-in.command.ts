import { Command } from '@krater/building-blocks';
import { SpanContext } from 'opentracing';

export interface SignInCommandPayload {
  email: string;
  password: string;
  context: SpanContext;
}

export class SignInCommand implements Command<SignInCommandPayload> {
  constructor(public readonly payload: SignInCommandPayload) {}
}
