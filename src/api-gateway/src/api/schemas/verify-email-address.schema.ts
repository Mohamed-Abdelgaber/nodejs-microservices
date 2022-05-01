/**
 * @openapi
 *
 * components:
 *  schemas:
 *    VerifyEmailAddress:
 *      required:
 *        - email
 *        - verificationCode
 *      properties:
 *       email:
 *         type: string
 *         format: email
 *         example: john@doe.com
 *       verificationCode:
 *         type: string
 *         example: 3AK10Y
 */

export interface VerifyEmailAddressSchema {
  email: string;
  verificationCode: string;
}
