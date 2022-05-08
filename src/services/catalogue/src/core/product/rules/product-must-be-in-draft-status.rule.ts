import { ProductStatus } from '@core/product-status/product-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class ProductMustBeInDraftStatusRule implements BusinessRule {
  public readonly message = 'Product must be in Draft status.';

  constructor(private readonly status: ProductStatus) {}

  public isBroken(): boolean {
    return !this.status.equals(ProductStatus.Draft);
  }
}
