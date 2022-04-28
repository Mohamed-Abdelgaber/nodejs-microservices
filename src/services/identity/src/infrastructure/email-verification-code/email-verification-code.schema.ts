import { EmailVerificationCodeStatusValue } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import MongooseIdValidator from 'mongoose-id-validator';

export const EmailVerificationCodeSchema = new Schema({
  id: {
    type: String,
    required: true,
    maxlength: 200,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    maxlength: 100,
  },
  status: {
    type: String,
    enum: EmailVerificationCodeStatusValue,
    default: EmailVerificationCodeStatusValue.Archived,
    required: true,
    maxlength: 200,
  },
  generatedAt: {
    type: Date,
    required: true,
    maxlength: 200,
  },
});

EmailVerificationCodeSchema.index({ code: 1, status: 1, id: 1 });

EmailVerificationCodeSchema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
EmailVerificationCodeSchema.plugin(MongooseIdValidator);
