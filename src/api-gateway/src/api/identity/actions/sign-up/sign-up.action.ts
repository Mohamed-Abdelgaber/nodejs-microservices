import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

const registerNewAccountActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().trim().required(),
      firstName: Joi.string().trim().min(3).required(),
      lastName: Joi.string().trim().min(3).required(),
      zipCode: Joi.string().trim().min(3).required(),
      phoneNumber: Joi.string().trim().min(3).required(),
      phoneAreaCode: Joi.string().trim().min(2).required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @openapi
 *
 * /api/v1/identity/sign-up:
 *   post:
 *     tags:
 *        - Identity
 *     summary:
 *       This endpoint allows to register new account.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/RegisterNewAccount'
 *     responses:
 *       201:
 *        description: Account registered successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const signUpAction = ({ tracingMiddleware, serviceClient }: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  registerNewAccountActionValidation,
  async (req, res, next) =>
    serviceClient
      .send('identity.sign_up', { ...req.body, context: req.headers })
      .then(() => res.sendStatus(201))
      .catch(next),
];

export default signUpAction;
