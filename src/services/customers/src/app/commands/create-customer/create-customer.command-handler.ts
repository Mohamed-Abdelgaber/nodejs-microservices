import { Customer } from '@core/customer/customer';
import { AppError, CommandHandler, MessageBus } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';
import { CustomerCreatedEvent } from '@core/events/customer-created.event';
import { FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP, SpanContext, Tracer } from 'opentracing';

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
    const span = this.dependencies.tracer.startSpan('make_request');

    const headers = {};

    this.dependencies.tracer.inject(span, FORMAT_HTTP_HEADERS, headers);

    const res = await fetch(`${process.env.FABIO_URL}/fraud/api/v1/fraud-check/1`, {
      headers,
    });

    const { isFraudulent } = (await res.json()) as any;

    if (isFraudulent) {
      throw new AppError(`Customer is fraudster.`);
    }

    const customer = new Customer('1', payload.firstName, payload.lastName, payload.email);

    const spanContext = {};

    this.dependencies.tracer.inject(span.context(), FORMAT_TEXT_MAP, spanContext);

    await this.dependencies.messageBus.sendEvent(
      new CustomerCreatedEvent({
        email: payload.email,
        userId: '1',
      }),
      {
        spanContext: spanContext as SpanContext,
      },
    );

    span.finish();

    return customer.toJSON();
  }
}
