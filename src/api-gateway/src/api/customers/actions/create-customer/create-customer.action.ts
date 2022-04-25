import { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

interface Dependencies {
  tracingMiddleware: RequestHandler;
}

/**
 * @swagger
 *
 * /api/v1/customers:
 *   post:
 *     tags:
 *        - Customers
 *     summary:
 *       This endpoint allows to create new customer.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/CreateCustomer'
 *     responses:
 *       201:
 *        description: New customer created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  required: true
 *                  example: 1
 *                firstName:
 *                  type: string
 *                  required: true
 *                  example: John
 *                lastName:
 *                  type: string
 *                  required: true
 *                  example: Doe
 *                email:
 *                  type: string
 *                  format: email
 *                  required: true
 *                  example: john@doe.com
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 *
 */
const createCustomerAction = ({ tracingMiddleware }: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  proxy('localhost:4000', {
    proxyReqPathResolver: () => '/api/v1/customers',
  }),
];

export default createCustomerAction;
