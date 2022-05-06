import { Product } from '@core/product/product.aggregate-root';
import { ProductRepository } from '@core/product/product.repository';
import { ProductTypeModel } from '@infrastructure/product-type/product-type.model';
import { ProductModel } from './product.model';

export class ProductRepositoryImpl implements ProductRepository {
  public async insert(product: Product): Promise<void> {
    const { type, ...productData } = product.toJSON();

    await ProductModel.create(productData);

    const existingProductType = await ProductTypeModel.find({
      name: type,
    });

    if (existingProductType.length) {
      return;
    }

    const productTypeData = product.getType().toJSON();

    await ProductTypeModel.create(productTypeData);
  }
}
