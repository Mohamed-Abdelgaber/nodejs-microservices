import { ProductType } from '@core/product-type/product-type.entity';
import { Product } from '@core/product/product.aggregate-root';
import { ProductRepository } from '@core/product/product.repository';
import { ProductTypeModel } from '@infrastructure/product-type/product-type.model';
import { BusinessRuleValidationError } from '@krater/building-blocks';
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

  public async insertProductType(productType: ProductType): Promise<void> {
    const data = productType.toJSON();

    const existingProductType = await ProductTypeModel.find({
      name: data.name,
    });

    if (existingProductType.length) {
      throw new BusinessRuleValidationError(
        `Product with provided name: "${data.name}" already exists.`,
      );
    }

    await ProductTypeModel.create(data);
  }
}
