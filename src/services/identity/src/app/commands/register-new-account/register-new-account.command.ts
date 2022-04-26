import { Command } from '@krater/building-blocks';
import { RegisterNewAccountPayload } from '@core/account-registration/account-registration.aggregate-root';
import { SpanContext } from 'opentracing';

interface Payload extends RegisterNewAccountPayload {
  context: SpanContext;
}

export class RegisterNewAccountCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
