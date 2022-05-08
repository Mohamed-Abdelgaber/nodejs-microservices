import { ProductStatus } from '@core/product-status/product-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class ProductMustNotBeAlreadyArchivedRule implements BusinessRule {
  public readonly message = 'Selected Product is already archived.';

  constructor(private readonly status: ProductStatus) {}

  public isBroken(): boolean {
    return this.status.equals(ProductStatus.Archived);
  }
}
