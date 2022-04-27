import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  accountId: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
}

export class NewAccountRegisteredEvent extends DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {
    super('identity', payload);
  }
}
