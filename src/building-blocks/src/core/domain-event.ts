export class DomainEvent<PayloadType> {
  constructor(public readonly service: string, public readonly payload: PayloadType) {}
}
