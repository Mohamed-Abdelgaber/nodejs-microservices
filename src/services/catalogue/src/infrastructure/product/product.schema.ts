import { ProductStatusValue } from '@core/product-status/product-status.value-object';
import { Schema, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import MongooseIdValidator from 'mongoose-id-validator';

export const ProductSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      maxlength: 200,
    },
    name: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    type: {
      type: Types.ObjectId,
      ref: 'product_type',
    },
    status: {
      type: String,
      enum: ProductStatusValue,
      default: ProductStatusValue.Draft,
    },
    weight: {
      type: Number,
      min: 0,
      max: 1_000_000,
    },
    price: {
      type: Number,
      min: 0,
      max: 100_000_000,
    },
  },
  {
    timestamps: true,
  },
);

ProductSchema.index({ name: 1, id: 1 });

ProductSchema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
ProductSchema.plugin(MongooseIdValidator);
