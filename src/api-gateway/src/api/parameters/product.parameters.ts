/**
 * @openapi
 *
 * components:
 *  parameters:
 *    productIdParam:
 *      name: productId
 *      in: path
 *      description: Provide product ID.
 *      required: true
 *      schema:
 *        type: string
 *        format: uuid
 */
export interface ProductParameters {
  productId: string;
}
