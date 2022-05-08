import { ProductType } from '@core/product-type/product-type.entity';
import { Product } from './product.aggregate-root';

export interface ProductRepository {
  insert(product: Product): Promise<void>;

  insertProductType(productType: ProductType): Promise<void>;

  findById(id: string): Promise<Product | null>;

  update(product: Product): Promise<void>;
}
