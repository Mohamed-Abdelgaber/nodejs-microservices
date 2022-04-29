import { Customer } from './customer.aggregate-root';

export interface CustomerRepository {
  insert(customer: Customer): Promise<void>;

  update(customer: Customer): Promise<void>;

  findById(id: string): Promise<Customer | null>;
}
