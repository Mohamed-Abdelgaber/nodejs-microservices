import { ServiceClient } from '@krater/building-blocks';
import { RequestHandler } from 'express';
// import proxy from 'express-http-proxy';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

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
  async (req, res, next) =>
    serviceClient
      .send('identity.sign_up', { ...req.body, context: req.headers })
      .then(() => res.sendStatus(201))
      .catch(next),
];

export default signUpAction;
