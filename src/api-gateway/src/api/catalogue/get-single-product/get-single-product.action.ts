import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

const getSingleProductActionValidation = celebrate({
  [Segments.PARAMS]: {
    productId: Joi.string().uuid().required(),
  },
});

/**
 * @openapi
 *
 * /api/v1/catalogue/products/{productId}:
 *   get:
 *     tags:
 *        - Catalogue
 *     summary:
 *       This endpoint allows to fetch all products.
 *     parameters:
 *      - productId:
 *        in: path
 *        name: productId
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     responses:
 *       200:
 *        description: Single product fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  schema:
 *                    $ref: '#components/schemas/Product'
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const getSingleProductAction = ({
  serviceClient,
  tracingMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  getSingleProductActionValidation,
  async (req, res, next) =>
    serviceClient
      .send(
        'catalogue.get_single_product',
        {
          productId: req.params.productId,
        },
        {
          requestHeaders: req.headers,
        },
      )
      .then((product) => res.status(200).json(product))
      .catch(next),
];

export default getSingleProductAction;
