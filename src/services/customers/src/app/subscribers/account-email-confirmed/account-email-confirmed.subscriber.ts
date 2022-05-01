import { CustomerRepository } from '@core/customer/customer.repository';
import { EventSubscriber, MessageContext, NotFoundError } from '@krater/building-blocks';
import { AccountEmailConfirmedEvent } from '@root/integration-events/account-email-confirmed.event';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  tracer: Tracer;
  customerRepository: CustomerRepository;
}

export class AccountEmailConfirmedSubscriber
  implements EventSubscriber<AccountEmailConfirmedEvent>
{
  public readonly type = `identity.${AccountEmailConfirmedEvent.name}.customers`;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(
    event: AccountEmailConfirmedEvent,
    messageContext: MessageContext,
  ): Promise<void> {
    const { customerRepository, tracer } = this.dependencies;

    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, messageContext.spanContext);

    const span = tracer.startSpan('[Subscriber] Creating new customer', {
      childOf: ctx,
    });

    span.addTags({
      'x-type': 'subscriber',
    });

    const customer = await customerRepository.findById(event.payload.accountId);

    if (!customer) {
      throw new NotFoundError("Can't activate customer. Customer does not exist.");
    }

    customer.activate(new Date(event.payload.activatedAt));

    await customerRepository.update(customer);

    span.finish();
  }
}
