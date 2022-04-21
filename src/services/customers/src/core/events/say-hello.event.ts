import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  message: string;
}

export class SayHelloEvent extends DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {
    super('customers', payload);
  }
}
