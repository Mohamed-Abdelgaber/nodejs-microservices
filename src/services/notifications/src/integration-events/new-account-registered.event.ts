import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  accountId: string;
  email: string;
  firstName: string;
  lastName: string;
  verificationCode: string;
}

export class NewAccountRegisteredEvent extends DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {
    super('identity', payload);
  }
}
