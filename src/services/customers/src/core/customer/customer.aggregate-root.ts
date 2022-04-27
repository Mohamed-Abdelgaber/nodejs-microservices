import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';

interface CustomerProps {
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
  activatedAt: Date | null;
}

interface CreateNewCustomerPayload {
  accountId: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
}

export class Customer extends AggregateRoot<CustomerProps> {
  private constructor(props: CustomerProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ accountId, ...payload }: CreateNewCustomerPayload) {
    return new Customer(
      {
        ...payload,
        activatedAt: null,
      },
      new UniqueEntityID(accountId),
    );
  }

  public toJSON() {
    return {
      id: this.id.value,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      zipCode: this.props.zipCode,
      phoneNumber: this.props.phoneNumber,
      phoneAreaCode: this.props.phoneAreaCode,
      activatedAt: this.props.activatedAt,
    };
  }
}
