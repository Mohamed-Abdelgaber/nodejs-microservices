import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

const createNewProductActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    weight: Joi.number().required().min(0).integer(),
    price: Joi.number().min(0).integer(),
  }),
});

/**
 * @openapi
 *
 * /api/v1/catalogue/products:
 *   post:
 *     tags:
 *        - Catalogue
 *     summary:
 *       This endpoint allows to create new product.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/CreateNewProduct'
 *     responses:
 *       201:
 *        description: Product created successfuly.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const createNewProductAction = ({
  serviceClient,
  tracingMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  createNewProductActionValidation,
  async (req, res, next) =>
    serviceClient
      .send('catalogue.create_new_product', req.body, {
        requestHeaders: req.headers,
      })
      .then((product) => res.status(201).json(product))
      .catch(next),
];

export default createNewProductAction;
