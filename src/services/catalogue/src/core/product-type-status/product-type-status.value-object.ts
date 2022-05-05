import { ProductTypeStatusNotSupported } from '@core/errors/product-type-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum ProductTypeStatusValue {
  Active = 'Active',
  Archived = 'Archived',
}

interface ProductTypeStatusProps {
  value: string;
}

export class ProductTypeStatus extends ValueObject<ProductTypeStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Active = new ProductTypeStatus(ProductTypeStatusValue.Active);

  public static Archived = new ProductTypeStatus(ProductTypeStatusValue.Archived);

  public static fromValue(value: string) {
    switch (value) {
      case ProductTypeStatusValue.Active:
        return this.Active;

      case ProductTypeStatusValue.Archived:
        return this.Archived;

      default:
        throw new ProductTypeStatusNotSupported();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
