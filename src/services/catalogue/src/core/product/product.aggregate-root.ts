import { ProductStatus } from '@core/product-status/product-status.value-object';
import { PersistedProductType, ProductType } from '@core/product-type/product-type.entity';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';

interface ProductProps {
  name: string;
  description: string;
  type: ProductType;
  weight: number;
  price: number;
  status: ProductStatus;
}

interface PersistedProduct {
  id: string;
  name: string;
  description: string;
  type: PersistedProductType;
  weight: number;
  price: number;
  status: string;
}

export interface CreateNewProductPayload {
  name: string;
  description: string;
  type: string;
  weight: number;
  price: number;
}

export class Product extends AggregateRoot<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ type, ...payload }: CreateNewProductPayload) {
    return new Product({
      ...payload,
      type: ProductType.createNew(type),
      status: ProductStatus.Draft,
    });
  }

  public static fromPersistence({ id, type, status, ...data }: PersistedProduct) {
    return new Product(
      {
        ...data,
        type: ProductType.fromPersistence(type),
        status: ProductStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public getType() {
    return this.props.type;
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.props.name,
      description: this.props.description,
      type: this.props.type.getName(),
      weight: this.props.weight,
      price: this.props.price,
      status: this.props.status.getValue(),
    };
  }
}
