/**
 * @openapi
 *
 * components:
 *  schemas:
 *    SignIn:
 *      required:
 *        - email
 *        - password
 *      properties:
 *       email:
 *         type: string
 *         format: email
 *         example: john@doe.com
 *       password:
 *         type: string
 *         example: test123
 */
export interface SignUpSchema {
  email: string;
  password: string;
}
