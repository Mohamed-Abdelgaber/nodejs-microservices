import { ProductStatusValue } from '@core/product-status/product-status.value-object';
import { ProductModel } from '@infrastructure/product/product.model';
import { QueryHandler, serializeDataToPaginatedResponse } from '@krater/building-blocks';
import { Product } from '../product';
import { GetProductsQuery } from './get-products.query';

interface GetProductsQueryResult {
  data: Product[];
}

export class GetProductsQueryHandler
  implements QueryHandler<GetProductsQuery, GetProductsQueryResult>
{
  public async handle({
    payload: { itemsPerPage, page },
  }: GetProductsQuery): Promise<GetProductsQueryResult> {
    const total = await ProductModel.count({
      status: ProductStatusValue.Active,
    });

    const products = await ProductModel.find({
      status: ProductStatusValue.Active,
    })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return serializeDataToPaginatedResponse(products, total, page, itemsPerPage);
  }
}
