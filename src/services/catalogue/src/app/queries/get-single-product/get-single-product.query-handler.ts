import { ProductStatusValue } from '@core/product-status/product-status.value-object';
import { ProductModel } from '@infrastructure/product/product.model';
import { QueryHandler } from '@krater/building-blocks';
import { Product } from '../product';
import { GetSingleProductQuery } from './get-single-product.query';

export class GetSingleProductQueryHandler implements QueryHandler<GetSingleProductQuery, Product> {
  public async handle({ payload: { productId } }: GetSingleProductQuery): Promise<Product | null> {
    const result = await ProductModel.findOne({
      id: productId,
      status: ProductStatusValue.Active,
    });

    if (!result) {
      return null;
    }

    return result;
  }
}
