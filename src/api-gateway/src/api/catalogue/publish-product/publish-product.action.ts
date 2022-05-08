import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  serviceClient: ServiceClient;
  tracingMiddleware: RequestHandler;
}

const publishProductActionValidation = celebrate({
  [Segments.PARAMS]: {
    productId: Joi.string().uuid().required(),
  },
});

/**
 * @openapi
 *
 * /api/v1/catalogue/products/{productId}/publish:
 *   patch:
 *     tags:
 *        - Catalogue
 *     summary:
 *       This endpoint allows to publish single product.
 *     parameters:
 *       - $ref: '#components/parameters/productIdParam'
 *     responses:
 *       204:
 *        description: Product published successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const publishProductAction = ({
  serviceClient,
  tracingMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  publishProductActionValidation,
  async (req, res, next) =>
    serviceClient
      .send(
        'catalogue.publish_product',
        {
          productId: req.params.productId,
        },
        {
          requestHeaders: req.headers,
        },
      )
      .then(() => res.sendStatus(204))
      .catch(next),
];

export default publishProductAction;
