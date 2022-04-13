import { DomainEvent } from '@core/domain-event';
import { Entity } from '@core/entity';

export abstract class AggregateRoot<PayloadType extends object = {}> extends Entity<PayloadType> {
  private domainEvents: DomainEvent<unknown>[] = [];

  protected addDomainEvent(event: DomainEvent<unknown>) {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): ReadonlyArray<DomainEvent<unknown>> {
    return this.domainEvents;
  }

  public clearDomainEvents() {
    this.domainEvents = [];
  }
}
