import { model } from 'mongoose';
import { CustomerSchema } from './customer.schema';

export const CustomerModel = model('customer', CustomerSchema);
