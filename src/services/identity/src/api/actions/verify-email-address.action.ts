import { VerifyEmailAddressCommand } from '@app/commands/verify-email-address/verify-email-address.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  commandBus: CommandBus;
  tracer: Tracer;
}

export const verifyEmailAddressActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().trim().email().required(),
      code: Joi.string().trim().length(6).required(),
    }),
  },
  {
    abortEarly: false,
  },
);

const verifyEmailAddressAction =
  ({ commandBus, tracer }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    return commandBus
      .handle(
        new VerifyEmailAddressCommand({
          ...req.body,
          verificationCode: req.body.code,
          context: ctx,
        }),
      )
      .then(() => res.sendStatus(200))
      .catch(next);
  };

export default verifyEmailAddressAction;
