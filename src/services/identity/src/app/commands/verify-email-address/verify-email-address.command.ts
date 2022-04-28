import { Command } from '@krater/building-blocks';
import { SpanContext } from 'opentracing';

interface Payload {
  email: string;
  verificationCode: string;
  context: SpanContext;
}

export class VerifyEmailAddressCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
