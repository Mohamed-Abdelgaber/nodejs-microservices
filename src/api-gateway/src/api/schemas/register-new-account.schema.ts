/**
 * @openapi
 *
 * components:
 *  schemas:
 *    RegisterNewAccount:
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
 *       password:
 *         type: string
 *         example: test123
 *       zipCode:
 *         type: string
 *         example: 41-303
 *       phoneNumber:
 *         type: string
 *         example: 123-456-789
 *       phoneAreaCode:
 *         type: string
 *         example: '+48'
 */
export interface RegisterNewAccountSchema {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
}
