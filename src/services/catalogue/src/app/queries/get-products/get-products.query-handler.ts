import { ProductModel } from '@infrastructure/product/product.model';
import { QueryHandler, serializeDataToPaginatedResponse } from '@krater/building-blocks';
import { GetProductsQuery } from './get-products.query';

interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  weight: number;
  price: number;
}

interface GetProductsQueryResult {
  data: Product[];
}

export class GetProductsQueryHandler
  implements QueryHandler<GetProductsQuery, GetProductsQueryResult>
{
  public async handle({
    payload: { itemsPerPage, page },
  }: GetProductsQuery): Promise<GetProductsQueryResult> {
    const total = await ProductModel.count();

    const products = await ProductModel.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return serializeDataToPaginatedResponse(products, total, page, itemsPerPage);
  }
}
