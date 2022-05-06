import { model } from 'mongoose';
import { ProductSchema } from './product.schema';

export const ProductModel = model('product', ProductSchema);
