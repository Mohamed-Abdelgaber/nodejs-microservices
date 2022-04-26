import { model } from 'mongoose';
import { AccountSchema } from './account.schema';

export const AccountModel = model('account', AccountSchema);
