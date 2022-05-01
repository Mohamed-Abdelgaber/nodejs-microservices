import { ServiceClient } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

/**
 * @openapi
 *
 * /api/v1/identity/resend-email-verification-code:
 *   post:
 *     tags:
 *        - Identity
 *     summary:
 *       This endpoint allows to resend email verification code.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/ResendEmailVerificationCode'
 *     responses:
 *       204:
 *        description: Email verification code sent successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const resendEmailVerificationCodeAction = ({
  serviceClient,
  tracingMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  (req, res, next) =>
    serviceClient
      .send('identity.resend_email_verification_code', {
        ...req.body,
        context: req.headers,
      })
      .then(() => res.sendStatus(204))
      .catch(next),
];

export default resendEmailVerificationCodeAction;
