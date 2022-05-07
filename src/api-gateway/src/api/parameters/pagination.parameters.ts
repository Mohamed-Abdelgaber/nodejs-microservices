/**
 * @openapi
 *
 * components:
 *  parameters:
 *    itemsPerPageParam:
 *      name: itemsPerPage
 *      in: query
 *      type: number
 *      description: How many items should be per page
 *      schema:
 *        type: integer
 *        format: int32
 *        minimum: 1
 *        default: 20
 *    pageParam:
 *      name: page
 *      in: query
 *      type: number
 *      description: Current page
 *      schema:
 *        type: integer
 *        format: int32
 *        minimum: 1
 *        default: 1
 */
export interface PaginationParameters {
  page: number;
  itemsPerPage: number;
}
