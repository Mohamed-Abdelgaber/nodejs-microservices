/**
 * @openapi
 *
 * components:
 *  schemas:
 *    CreateNewProduct:
 *      required:
 *        - name
 *        - description
 *        - type
 *        - weight
 *        - price
 *      properties:
 *       name:
 *         type: string
 *         example: iPhone 8
 *       description:
 *         type: string
 *         example: The iPhone 8 and iPhone 8 Plus are smartphones designed, developed, and marketed by Apple Inc. They make up the 11th generation of the iPhone.
 *       type:
 *         type: string
 *         example: Smartphone
 *       weight:
 *         type: number
 *         format: int64
 *         example: 148
 *         description: Weight in grams
 *       price:
 *         type: number
 *         format: int64
 *         example: 48300
 *         description: Price in cents
 */
export interface CreateNewProductSchema {
  name: string;
  description: string;
  type: string;
  weight: number;
  price: number;
}
