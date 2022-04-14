import { AggregateRoot } from '@core/aggregate-root';
import { DomainEvent } from '@core/domain-event';
import { Logger } from '..';
import { EventDispatcher } from './event-dispatcher';
import { EventSubscriber } from './event-subscriber';

interface Dependencies {
  subscribers: EventSubscriber<any>[];
  logger: Logger;
}

export class InMemoryEventDispatcher implements EventDispatcher {
  constructor(private readonly dependencies: Dependencies) {}

  public async dispatchEvent(event: DomainEvent<{}>): Promise<void> {
    const subscriberHandlerPromises = this.dependencies.subscribers
      .filter((subscriber) => subscriber.type === event.constructor.name)
      .map((subscriber) =>
        subscriber
          .handle(event)
          .catch((error) =>
            this.dependencies.logger.error(
              `Subscriber failed to handle event "${subscriber.type}".`,
              error,
            ),
          ),
      );

    if (!subscriberHandlerPromises.length) {
      return;
    }

    this.dependencies.logger.info(`Dispatching handlers for event "${event.constructor.name}".`);

    await Promise.all(subscriberHandlerPromises);
  }

  public async dispatchEventsForAggregate(aggregate: AggregateRoot<{}>): Promise<void> {
    const events = aggregate.getDomainEvents();

    aggregate.clearDomainEvents();

    const eventNames = events.map((event) => event.constructor.name);

    const subscriberHandlerPromises = this.dependencies.subscribers
      .filter((subscriber) => eventNames.includes(subscriber.type))
      .map((subscriber) => {
        const eventForSubscriber = events.find(
          (event) => event.constructor.name === subscriber.type,
        );

        return subscriber.handle(eventForSubscriber).catch((error) => {
          this.dependencies.logger.error(
            `Subscriber failed to handle event "${subscriber.type}".`,
            error,
          );

          throw error;
        });
      });

    if (!subscriberHandlerPromises.length) {
      return;
    }

    this.dependencies.logger.info(`Dispatching handlers for events ${eventNames.join(', ')}.`);

    await Promise.all(subscriberHandlerPromises);
  }
}
