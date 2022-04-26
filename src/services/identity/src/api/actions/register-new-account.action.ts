import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { RegisterNewAccountCommand } from '@app/commands/register-new-account/register-new-account.command';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  commandBus: CommandBus;
  tracer: Tracer;
}

export const registerNewAccountActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required(),
    firstName: Joi.string().trim().min(3).required(),
    lastName: Joi.string().trim().min(3).required(),
    zipCode: Joi.string().trim().min(3).required(),
    phoneNumber: Joi.string().trim().min(3).required(),
    phoneAreaCode: Joi.string().trim().min(2).required(),
  }),
});

const registerNewAccountAction =
  ({ commandBus, tracer }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    return commandBus
      .handle(new RegisterNewAccountCommand({ ...req.body, context: ctx }))
      .then(() => res.sendStatus(201))
      .catch(next);
  };

export default registerNewAccountAction;
