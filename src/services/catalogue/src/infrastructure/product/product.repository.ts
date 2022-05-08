import { ProductType } from '@core/product-type/product-type.entity';
import { Product } from '@core/product/product.aggregate-root';
import { ProductRepository } from '@core/product/product.repository';
import { ProductTypeModel } from '@infrastructure/product-type/product-type.model';
import { BusinessRuleValidationError } from '@krater/building-blocks';
import { ProductModel } from './product.model';

export class ProductRepositoryImpl implements ProductRepository {
  public async insert(product: Product): Promise<void> {
    const { type, ...productData } = product.toJSON();

    let existingProductType = await ProductTypeModel.findOne({
      name: type,
    });

    if (!existingProductType) {
      const productTypeData = product.getType().toJSON();

      existingProductType = await ProductTypeModel.create(productTypeData);
    }

    await ProductModel.create({ ...productData, type: existingProductType._id });
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

  public async findById(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      id,
    }).select(['id', 'name', 'description', 'type', 'status', 'weight', 'price']);

    if (!product) {
      return null;
    }

    const productType = await ProductTypeModel.findOne({
      _id: product.type,
    });

    return Product.fromPersistence({
      ...product.toJSON(),
      type: productType.toJSON(),
    });
  }

  public async update(product: Product): Promise<void> {
    const { id, status } = product.toJSON();

    await ProductModel.updateOne(
      { id },
      {
        status,
      },
    );
  }
}
