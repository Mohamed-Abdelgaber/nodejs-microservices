import { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

interface Dependencies {
  tracingMiddleware: RequestHandler;
}

/**
 * @openapi
 *
 * /api/v1/fraud/fraud-check/{customerId}:
 *   get:
 *     tags:
 *        - Fraud
 *     summary:
 *       This endpoint checks if provided customer is fraudulent.
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *        description: Return `isFraudulent` which tells if customer is frauduluent.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                isFraudulent:
 *                  type: boolean
 *                  required: true
 *                  example: true
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const isFraudulentCustomerAction = ({ tracingMiddleware }: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  proxy('localhost:4200', {
    proxyReqPathResolver: () => '/api/v1/fraud-check/:customerId',
  }),
];

export default isFraudulentCustomerAction;
