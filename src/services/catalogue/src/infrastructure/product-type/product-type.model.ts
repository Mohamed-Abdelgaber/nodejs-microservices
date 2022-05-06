import { model } from 'mongoose';
import { ProductTypeSchema } from './product-type.schema';

export const ProductTypeModel = model('productType', ProductTypeSchema);
