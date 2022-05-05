import { Product } from './product.aggregate-root';

export interface ProductRepository {
  insert(product: Product): Promise<void>;
}
