import { KraterError, CommandHandler } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';
import { Customer } from '@core/customer/customer.aggregate-root';
import { CustomerRepository } from '@core/customer/customer.repository';

interface Dependencies {
  tracer: Tracer;
  customerRepository: CustomerRepository;
}

export class CreateCustomerCommandHandler implements CommandHandler<CreateCustomerCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload: { context, ...payload } }: CreateCustomerCommand): Promise<void> {
    const span = this.dependencies.tracer.startSpan('Create Customer Command', {
      childOf: context,
    });

    span.addTags({
      'x-type': 'command',
    });

    const headers = {};

    this.dependencies.tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);

    const res = await fetch(`http://localhost:4200/api/v1/fraud-check/1`, {
      headers,
    });

    const { isFraudulent } = (await res.json()) as any;

    if (isFraudulent) {
      throw new KraterError(`Customer is fraudster.`);
    }

    const customer = Customer.createNew(payload);

    await this.dependencies.customerRepository.insert(customer);

    span.finish();
  }
}
