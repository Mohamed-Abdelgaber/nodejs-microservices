import { Command } from '@krater/building-blocks';
import { SpanContext } from 'opentracing';

export interface CreateCustomerCommandPayload {
  accountId: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
  context: SpanContext;
}

export class CreateCustomerCommand implements Command<CreateCustomerCommandPayload> {
  public readonly service = 'customers';

  constructor(public readonly payload: CreateCustomerCommandPayload) {}
}
