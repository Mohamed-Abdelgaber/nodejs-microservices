import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  serviceClient: ServiceClient;
  tracingMiddleware: RequestHandler;
  authMiddleware: RequestHandler;
}

const changePasswordActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      oldPassword: Joi.string().trim().required(),
      newPassword: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @openapi
 *
 * /api/v1/identity/change-password:
 *   patch:
 *     tags:
 *        - Identity
 *     security:
 *       - bearerAuth: []
 *     summary:
 *       This endpoint allows to change password.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/ChangePassword'
 *     responses:
 *       201:
 *        description: Account password changed succesfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const changePasswordAction = ({
  serviceClient,
  tracingMiddleware,
  authMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  authMiddleware,
  changePasswordActionValidation,
  (req, res, next) =>
    serviceClient
      .send('identity.change_password', {
        ...req.body,
        accountId: res.locals.accountId,
        context: req.headers,
      })
      .then(() => res.sendStatus(204))
      .catch(next),
];

export default changePasswordAction;
