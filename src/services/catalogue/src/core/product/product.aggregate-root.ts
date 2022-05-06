import { PersistedProductType, ProductType } from '@core/product-type/product-type.entity';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';

interface ProductProps {
  name: string;
  description: string;
  type: ProductType;
  weight: number;
  price: number;
}

interface PersistedProduct {
  id: string;
  name: string;
  description: string;
  type: PersistedProductType;
  weight: number;
  price: number;
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
    });
  }

  public static fromPersistence({ id, type, ...data }: PersistedProduct) {
    return new Product(
      {
        ...data,
        type: ProductType.fromPersistence(type),
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
    };
  }
}
