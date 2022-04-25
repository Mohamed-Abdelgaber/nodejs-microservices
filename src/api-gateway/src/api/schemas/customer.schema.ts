import { CreateCustomerSchema } from './create-customer.schema';

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Customer:
 *      allOf:
 *        - $ref: '#components/schemas/CreateCustomer'
 *        - type: object
 *      required:
 *        - id
 *      properties:
 *        id:
 *          type: string
 *          example: 1
 */
export interface CustomerSchema extends CreateCustomerSchema {
  id: string;
}
