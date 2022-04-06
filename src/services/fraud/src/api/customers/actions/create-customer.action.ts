import {
  CreateCustomerCommand,
  CreateCustomerCommandPayload,
} from '@app/commands/create-customer/create-customer.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const createCustomerActionValidation = celebrate<CreateCustomerCommandPayload>({
  [Segments.BODY]: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
  },
}) as unknown as RequestHandler;

const createCustomerAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new CreateCustomerCommand(req.body))
      .then((customer) => res.status(200).json(customer))
      .catch(next);

export default createCustomerAction;
