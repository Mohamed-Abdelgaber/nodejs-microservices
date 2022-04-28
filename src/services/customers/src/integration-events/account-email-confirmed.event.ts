import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  accountId: string;
  activatedAt: string;
}

export class AccountEmailConfirmedEvent extends DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {
    super('identity', payload);
  }
}
