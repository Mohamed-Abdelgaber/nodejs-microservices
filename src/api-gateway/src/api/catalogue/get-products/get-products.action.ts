import { ServiceClient } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  tracingMiddleware: RequestHandler;
  serviceClient: ServiceClient;
}

/**
 * @openapi
 *
 * /api/v1/catalogue/products:
 *   get:
 *     tags:
 *        - Catalogue
 *     summary:
 *       This endpoint allows to fetch all products.
 *     parameters:
 *       - $ref: '#components/parameters/itemsPerPageParam'
 *       - $ref: '#components/parameters/pageParam'
 *     responses:
 *       200:
 *        description: Products fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
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
const getProductsAction = ({
  serviceClient,
  tracingMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  async (req, res, next) =>
    serviceClient
      .send(
        'catalogue.get_products',
        {
          itemsPerPage: req.query.itemsPerPage,
          page: req.query.page,
        },
        {
          requestHeaders: req.headers,
        },
      )
      .then((data) => res.status(200).json(data))
      .catch(next),
];

export default getProductsAction;
