import { Customer } from '@core/customer/customer';
import { AppError, CommandHandler, MessageBus, MessageContext } from '@krater/building-blocks';
import { CreateCustomerCommand } from './create-customer.command';
import fetch from 'node-fetch';
import { CustomerCreatedEvent } from '@core/events/customer-created.event';
import { FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP, Tracer } from 'opentracing';
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

  public async handle(
    { payload }: CreateCustomerCommand,
    { spanContext }: MessageContext,
  ): Promise<CreateCustomerCommandResult> {
    const context = this.dependencies.tracer.extract(FORMAT_TEXT_MAP, spanContext);

    const span = this.dependencies.tracer.startSpan('create-customer-command-handler', {
      childOf: context,
    });

    const headers = {};

    this.dependencies.tracer.inject(context, FORMAT_HTTP_HEADERS, headers);

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
        spanContext: context,
      },
    );

    await this.dependencies.messageBus.sendEvent(
      new SayHelloEvent({
        message: 'Howdy from Customers MS',
      }),
      {
        spanContext: context,
      },
    );

    span.finish();

    return customer.toJSON();
  }
}
