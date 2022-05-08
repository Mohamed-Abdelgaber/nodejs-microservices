import { ProductStatus } from '@core/product-status/product-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class ProductMustNotBeAlreadyDeletedRule implements BusinessRule {
  public readonly message = 'Selected Product is already deleted.';

  constructor(private readonly status: ProductStatus) {}

  public isBroken(): boolean {
    return this.status.equals(ProductStatus.Deleted);
  }
}
