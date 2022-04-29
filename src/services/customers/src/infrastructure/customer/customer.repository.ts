import { Customer } from '@core/customer/customer.aggregate-root';
import { CustomerRepository } from '@core/customer/customer.repository';
import { CustomerModel } from './customer.model';

export class CustomerRepositoryImpl implements CustomerRepository {
  public async insert(customer: Customer): Promise<void> {
    await CustomerModel.create(customer.toJSON());
  }

  public async update(customer: Customer): Promise<void> {
    const { id, ...data } = customer.toJSON();

    await CustomerModel.updateOne({ id }, { $set: data });
  }

  public async findById(id: string): Promise<Customer | null> {
    const result = await CustomerModel.findOne({
      id,
    });

    if (!result) {
      return null;
    }

    return Customer.fromPersistence(result);
  }
}
