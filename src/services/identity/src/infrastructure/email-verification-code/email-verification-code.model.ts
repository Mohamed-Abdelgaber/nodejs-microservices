import { model } from 'mongoose';
import { EmailVerificationCodeSchema } from './email-verification-code.schema';

export const EmailVerificationCodeModel = model(
  'emailVerificationCode',
  EmailVerificationCodeSchema,
);
