/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Product:
 *      allOf:
 *        - $ref: '#components/schemas/CreateNewProduct'
 *        - type: object
 *      required:
 *        - id
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 */
export interface ProductSchema {
  id: string;
  name: string;
  description: string;
  type: string;
  weight: number;
  price: number;
}
