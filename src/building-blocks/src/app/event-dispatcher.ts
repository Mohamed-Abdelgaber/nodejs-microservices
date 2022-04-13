import { UnitOfWork } from '@krater/database';
import { AggregateRoot, DomainEvent } from '..';

export interface EventDispatcher {
  dispatchEvent(event: DomainEvent<unknown>, unitOfWork: UnitOfWork): Promise<void>;

  dispatchEventsForAggregate(aggregate: AggregateRoot, unitOfWork: UnitOfWork): Promise<void>;
}
