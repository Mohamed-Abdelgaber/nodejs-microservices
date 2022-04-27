import { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import MongooseIdValidator from 'mongoose-id-validator';

export const CustomerSchema = new Schema({
  id: {
    type: String,
    required: true,
    maxlength: 200,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 200,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 200,
  },
  zipCode: {
    type: String,
    required: true,
    maxlength: 100,
  },
  phoneNumber: {
    type: String,
    required: true,
    maxlength: 100,
  },
  phoneAreaCode: {
    type: String,
    required: true,
    maxlength: 100,
  },
  activatedAt: {
    type: Date,
    maxlength: 200,
    required: false,
    default: null,
  },
});

CustomerSchema.index({ id: 1 });

CustomerSchema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
CustomerSchema.plugin(MongooseIdValidator);
