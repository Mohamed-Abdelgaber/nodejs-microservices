import { ProductTypeStatus } from '@core/product-type-status/product-type-status.value-object';
import { Entity, UniqueEntityID } from '@krater/building-blocks';

interface ProductTypeProps {
  name: string;
  status: ProductTypeStatus;
}

export interface PersistedProductType {
  id: string;
  name: string;
  status: string;
}

export class ProductType extends Entity<ProductTypeProps> {
  private constructor(props: ProductTypeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(name: string) {
    return new ProductType({
      name,
      status: ProductTypeStatus.Active,
    });
  }

  public static fromPersistence({ id, name, status }: PersistedProductType) {
    return new ProductType(
      {
        name,
        status: ProductTypeStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public getName() {
    return this.props.name;
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.props.name,
      status: this.props.status.getValue(),
    };
  }
}
