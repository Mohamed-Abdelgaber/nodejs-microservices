import { ProductStatus } from '@core/product-status/product-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class ProductMustNotBeAlreadyPublishedRule implements BusinessRule {
  public readonly message = 'Selected Product is already published.';

  constructor(private readonly status: ProductStatus) {}

  public isBroken(): boolean {
    return this.status.equals(ProductStatus.Active);
  }
}
