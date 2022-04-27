import { Customer } from './customer.aggregate-root';

export interface CustomerRepository {
  insert(customer: Customer): Promise<void>;
}
