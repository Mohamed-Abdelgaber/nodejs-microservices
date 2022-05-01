/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ResendEmailVerificationCode:
 *      required:
 *        - email
 *      properties:
 *       email:
 *         type: string
 *         format: email
 *         example: john@doe.com
 */
export interface ResendEmailVerificationCodeSchema {
  email: string;
}
