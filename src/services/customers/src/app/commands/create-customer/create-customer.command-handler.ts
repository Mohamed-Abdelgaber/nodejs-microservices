import { Customer } from '@core/customer/customer';
import { AppError, CommandHandler } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';
import Consul from 'consul';

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
    const consul = new Consul({
      host: '127.0.0.1',
      port: '8500',
      promisify: true,
    });

    // @ts-ignore
    const fraudService = Object.values(await consul.agent.services()).find(
      (service: any) => service.Service === 'fraud',
    ) as any;

    const res = await fetch(
      `http://${fraudService.Address}:${fraudService.Port}/api/v1/fraud-check/1`,
    );
    const { isFraudulent } = (await res.json()) as any;

    if (isFraudulent) {
      throw new AppError(`Customer is fraudster.`);
    }

    const customer = new Customer('1', payload.firstName, payload.lastName, payload.email);

    return customer.toJSON();
  }
}
