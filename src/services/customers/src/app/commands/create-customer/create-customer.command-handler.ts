import { Customer } from '@core/customer/customer';
import { AppError, CommandHandler, MessageBus } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';
import { CustomerCreatedEvent } from '@core/events/customer-created.event';

export interface CreateCustomerCommandResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Dependencies {
  messageBus: MessageBus;
}

export class CreateCustomerCommandHandler
  implements CommandHandler<CreateCustomerCommand, CreateCustomerCommandResult>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload }: CreateCustomerCommand): Promise<CreateCustomerCommandResult> {
    const res = await fetch(`${process.env.FABIO_URL}/fraud/api/v1/fraud-check/1`);

    const { isFraudulent } = (await res.json()) as any;

    if (isFraudulent) {
      throw new AppError(`Customer is fraudster.`);
    }

    const customer = new Customer('1', payload.firstName, payload.lastName, payload.email);

    await this.dependencies.messageBus.sendEvent(
      new CustomerCreatedEvent({
        email: payload.email,
        userId: '1',
      }),
      {
        resourceId: '',
      },
    );

    return customer.toJSON();
  }
}
