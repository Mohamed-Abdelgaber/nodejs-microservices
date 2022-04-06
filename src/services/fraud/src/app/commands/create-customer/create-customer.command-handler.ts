import { Customer } from '@core/customer/customer';
import { CommandHandler } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';

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
    const customer = new Customer('1', payload.firstName, payload.lastName, payload.email);

    return customer.toJSON();
  }
}
