import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

const verifyEmailAddressActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().trim().email().required(),
      verificationCode: Joi.string().trim().length(6).required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @openapi
 *
 * /api/v1/identity/verify-email:
 *   patch:
 *     tags:
 *        - Identity
 *     summary:
 *       This endpoint allows to verify user email address.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/VerifyEmailAddress'
 *     responses:
 *       204:
 *        description: Email address verified successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const verifyEmailAddressAction = ({
  tracingMiddleware,
  serviceClient,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  verifyEmailAddressActionValidation,
  (req, res, next) =>
    serviceClient
      .send(
        'identity.verify_email_address',
        {
          ...req.body,
          context: req.headers,
        },
        {
          requestHeaders: req.headers,
        },
      )
      .then(() => res.sendStatus(204))
      .catch(next),
];

export default verifyEmailAddressAction;
