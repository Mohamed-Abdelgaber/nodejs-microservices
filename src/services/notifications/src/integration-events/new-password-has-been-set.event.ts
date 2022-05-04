import { DomainEvent } from '@krater/building-blocks';

interface Payload {
  email: string;
}

export class NewPasswordHasBeenSetEvent implements DomainEvent<Payload> {
  public readonly service = 'identity';

  constructor(public readonly payload: Payload) {}
}
