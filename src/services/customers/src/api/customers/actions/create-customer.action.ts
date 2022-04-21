import {
  CreateCustomerCommand,
  CreateCustomerCommandPayload,
} from '@app/commands/create-customer/create-customer.command';
import { MessageBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { FORMAT_TEXT_MAP, SpanContext, Tracer } from 'opentracing';

interface Dependencies {
  messageBus: MessageBus;
  tracer: Tracer;
}

export const createCustomerActionValidation = celebrate<CreateCustomerCommandPayload>({
  [Segments.BODY]: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
  },
}) as unknown as RequestHandler;

const createCustomerAction =
  ({ messageBus, tracer }: Dependencies): RequestHandler =>
  async (req, res, next) => {
    const span = tracer.startSpan('create-customer-action');

    const ctx = {};

    tracer.inject(span.context(), FORMAT_TEXT_MAP, ctx);

    await messageBus.sendCommand(new CreateCustomerCommand(req.body), {
      spanContext: ctx as SpanContext,
    });

    span.finish();

    return res.sendStatus(202);
  };

export default createCustomerAction;
