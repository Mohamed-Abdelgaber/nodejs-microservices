/**
 * @openapi
 *
 * components:
 *  schemas:
 *    CreateCustomer:
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *      properties:
 *       firstName:
 *          type: string
 *          example: John
 *       lastName:
 *         type: string
 *         example: Doe
 *       email:
 *         type: string
 *         format: email
 *         example: john@doe.com
 *
 */

export interface CreateCustomerSchema {
  firstName: string;

  lastName: string;

  email: string;
}
