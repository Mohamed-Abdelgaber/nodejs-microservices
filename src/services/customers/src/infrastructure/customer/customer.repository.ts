import { Customer } from '@core/customer/customer.aggregate-root';
import { CustomerRepository } from '@core/customer/customer.repository';
import { CustomerModel } from './customer.model';

export class CustomerRepositoryImpl implements CustomerRepository {
  public async insert(customer: Customer): Promise<void> {
    await CustomerModel.create(customer.toJSON());
  }
}
