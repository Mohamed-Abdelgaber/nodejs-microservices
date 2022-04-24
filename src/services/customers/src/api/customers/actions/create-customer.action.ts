import {
  CreateCustomerCommand,
  CreateCustomerCommandPayload,
} from '@app/commands/create-customer/create-customer.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { Tracer, FORMAT_HTTP_HEADERS } from 'opentracing';

interface Dependencies {
  commandBus: CommandBus;
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
  ({ commandBus, tracer }: Dependencies): RequestHandler =>
  async (req, res, next) => {
    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    return commandBus
      .handle(new CreateCustomerCommand({ ...req.body, context: ctx }))
      .then((customer) => res.status(201).json(customer))
      .catch(next);
  };

export default createCustomerAction;
