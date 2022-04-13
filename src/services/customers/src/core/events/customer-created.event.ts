import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  userId: string;
  email: string;
}

export class CustomerCreatedEvent extends DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {
    super('customers', payload);
  }
}
