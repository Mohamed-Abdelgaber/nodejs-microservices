import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  serviceClient: ServiceClient;
  tracingMiddleware: RequestHandler;
}

const signInActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required(),
  }),
});

/**
 * @openapi
 *
 * /api/v1/identity/sign-in:
 *   post:
 *     tags:
 *        - Identity
 *     summary:
 *       This endpoint allows to sign up.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/SignIn'
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
const signInAction = ({ serviceClient, tracingMiddleware }: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  signInActionValidation,
  (req, res, next) =>
    serviceClient
      .send('identity.sign_in', {
        ...req.body,
        context: req.headers,
      })
      .then((tokenResponse) => res.status(200).json(tokenResponse))
      .catch(next),
];

export default signInAction;
