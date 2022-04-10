import { Customer } from '@core/customer/customer';
import { AppError, CommandHandler } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';

export interface CreateCustomerCommandResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class CreateCustomerCommandHandler
  implements CommandHandler<CreateCustomerCommand, CreateCustomerCommandResult>
{
  public async handle({ payload }: CreateCustomerCommand): Promise<CreateCustomerCommandResult> {
    const res = await fetch(`${process.env.FABIO_URL}/fraud/api/v1/fraud-check/1`);

    const { isFraudulent } = (await res.json()) as any;

    if (isFraudulent) {
      throw new AppError(`Customer is fraudster.`);
    }

    const customer = new Customer('1', payload.firstName, payload.lastName, payload.email);

    // TODO: Send notification

    return customer.toJSON();
  }
}
