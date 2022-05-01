import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  accountId: string;
  email: string;
  verificationCode: string;
}

export class EmailVerificationCodeHasBeenSentAgainEvent extends DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {
    super('identity', payload);
  }
}
