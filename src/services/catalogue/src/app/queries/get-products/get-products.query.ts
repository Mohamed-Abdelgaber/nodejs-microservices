import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  PaginatedQuery,
  Query,
} from '@krater/building-blocks';

export class GetProductsQuery implements Query<PaginatedQuery> {
  constructor(
    public readonly payload: PaginatedQuery = {
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      page: DEFAULT_PAGE,
    },
  ) {}
}
