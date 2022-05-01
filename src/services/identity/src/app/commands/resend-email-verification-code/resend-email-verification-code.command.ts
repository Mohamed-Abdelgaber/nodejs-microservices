import { Command } from '@krater/building-blocks';
import { SpanContext } from 'opentracing';

interface Payload {
  email: string;
  context: SpanContext;
}

export class ResendEmailVerificationCodeCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
