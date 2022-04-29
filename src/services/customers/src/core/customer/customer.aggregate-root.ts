import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { CustomerCantBeActivatedAlreadyRule } from './rules/customer-cant-be-activated-already.rule';

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

interface PersistedCustomer {
  id: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  phoneNumber: string;
  phoneAreaCode: string;
  activatedAt: Date | null;
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

  public static fromPersistence({ id, activatedAt, ...payload }: PersistedCustomer) {
    return new Customer(
      {
        ...payload,
        activatedAt: activatedAt ?? null,
      },
      new UniqueEntityID(id),
    );
  }

  public activate(activationDate: Date) {
    Customer.checkRule(new CustomerCantBeActivatedAlreadyRule(this.props.activatedAt));

    this.props.activatedAt = activationDate;
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
