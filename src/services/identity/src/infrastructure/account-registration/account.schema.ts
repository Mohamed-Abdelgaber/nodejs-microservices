import { AccountStatusValue } from '@core/account-status/account-status.value-object';
import { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import MongooseIdValidator from 'mongoose-id-validator';

export const AccountSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      maxlength: 200,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Email address is required.'],
      maxlength: [200, 'Email cannot contain more than 200 characters.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      maxlength: [400, 'Password cannot contain more than 400 characters'],
    },
    status: {
      type: String,
      enum: AccountStatusValue,
      default: AccountStatusValue.WaitingForEmailConfirmation,
      required: [true, 'Status is required.'],
      maxlength: [200, 'Status cannot contain more than 200 characters'],
    },
    registeredAt: {
      type: Date,
      maxlength: 200,
      required: true,
    },
    emailConfirmedAt: {
      type: Date,
      maxlength: 200,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

AccountSchema.index({ email: 1, status: 1, id: 1 });

AccountSchema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
AccountSchema.plugin(MongooseIdValidator);
