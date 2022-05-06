import { CreateCustomerCommand } from '@app/commands/create-customer/create-customer.command';
import { CommandBus, EventSubscriber, MessageContext } from '@krater/building-blocks';
import { NewAccountRegisteredEvent } from '@root/integration-events/new-account-registered.event';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  commandBus: CommandBus;
  tracer: Tracer;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = `identity.${NewAccountRegisteredEvent.name}.customers`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    event: NewAccountRegisteredEvent,
    messageContext: MessageContext,
  ): Promise<void> {
    const context = this.dependencies.tracer.extract(
      FORMAT_HTTP_HEADERS,
      messageContext.spanContext,
    );

    await this.dependencies.commandBus.handle(
      new CreateCustomerCommand({
        ...event.payload,
        context: messageContext.spanContext,
      }),
      {
        context,
      },
    );
  }
}
