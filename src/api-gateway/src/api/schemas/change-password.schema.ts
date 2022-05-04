/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ChangePassword:
 *      required:
 *        - oldPassword
 *        - newPassword
 *      properties:
 *       oldPassword:
 *          type: string
 *          example: test123
 *       newPassword:
 *         type: string
 *         example: Test123!
 */
export interface ChangePasswordSchema {
  oldPassword: string;
  newPassword: string;
}
