import { ProductStatusNotSupportedError } from '@core/errors/product-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum ProductStatusValue {
  Draft = 'Draft',
  Active = 'Active',
  Archived = 'Archived',
  Deleted = 'Deleted',
}

interface ProductStatusProps {
  value: string;
}

export class ProductStatus extends ValueObject<ProductStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Draft = new ProductStatus(ProductStatusValue.Draft);

  public static Active = new ProductStatus(ProductStatusValue.Active);

  public static Archived = new ProductStatus(ProductStatusValue.Archived);

  public static Deleted = new ProductStatus(ProductStatusValue.Deleted);

  public static fromValue(value: string) {
    switch (value) {
      case ProductStatusValue.Draft:
        return this.Draft;

      case ProductStatusValue.Active:
        return this.Active;

      case ProductStatusValue.Archived:
        return this.Archived;

      case ProductStatusValue.Deleted:
        return this.Deleted;

      default:
        throw new ProductStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
