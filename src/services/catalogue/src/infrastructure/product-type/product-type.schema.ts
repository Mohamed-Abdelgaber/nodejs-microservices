import { ProductTypeStatusValue } from '@core/product-type-status/product-type-status.value-object';
import { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import MongooseIdValidator from 'mongoose-id-validator';

export const ProductTypeSchema = new Schema(
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
      unique: true,
      maxlength: 200,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: ProductTypeStatusValue,
      default: ProductTypeStatusValue.Active,
    },
  },
  {
    timestamps: true,
  },
);

ProductTypeSchema.index({ id: 1, name: 1 });

ProductTypeSchema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
ProductTypeSchema.plugin(MongooseIdValidator);
