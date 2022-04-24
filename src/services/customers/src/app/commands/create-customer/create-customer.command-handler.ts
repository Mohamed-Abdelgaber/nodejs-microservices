import { Customer } from '@core/customer/customer';
import { AppError, CommandHandler, MessageBus } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';
import { CustomerCreatedEvent } from '@core/events/customer-created.event';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import { SayHelloEvent } from '@core/events/say-hello.event';

export interface CreateCustomerCommandResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Dependencies {
  messageBus: MessageBus;
  tracer: Tracer;
}

export class CreateCustomerCommandHandler
  implements CommandHandler<CreateCustomerCommand, CreateCustomerCommandResult>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload }: CreateCustomerCommand): Promise<CreateCustomerCommandResult> {
    const span = this.dependencies.tracer.startSpan('Create Customer Command', {
      childOf: payload.context,
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
      throw new AppError(`Customer is fraudster.`);
    }

    const customer = new Customer('1', payload.firstName, payload.lastName, payload.email);

    await this.dependencies.messageBus.sendEvent(
      new CustomerCreatedEvent({
        email: payload.email,
        userId: '1',
      }),
      {
        spanContext: headers as SpanContext,
      },
    );

    await this.dependencies.messageBus.sendEvent(
      new SayHelloEvent({
        message: 'Howdy from Customers MS',
      }),
      {
        spanContext: headers as SpanContext,
      },
    );

    span.finish();

    return customer.toJSON();
  }
}
