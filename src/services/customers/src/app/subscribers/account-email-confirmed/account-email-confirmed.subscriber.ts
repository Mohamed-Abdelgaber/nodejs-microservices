import { CustomerRepository } from '@core/customer/customer.repository';
import { EventSubscriber, MessageContext, NotFoundError } from '@krater/building-blocks';
import { AccountEmailConfirmedEvent } from '@root/integration-events/account-email-confirmed.event';

interface Dependencies {
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
    const { customerRepository } = this.dependencies;

    const customer = await customerRepository.findById(event.payload.accountId);

    if (!customer) {
      throw new NotFoundError("Can't activate customer. Customer does not exist.");
    }

    customer.activate(new Date(event.payload.activatedAt));

    await customerRepository.update(customer);
  }
}
