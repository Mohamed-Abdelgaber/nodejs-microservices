import { KraterError } from '@krater/building-blocks';

export class AccountStatusNotSupportedError extends KraterError {
  constructor(message = 'Provided Account Status is not supported.') {
    super(message, 'AccountStatusNotSupportedError', 422);
  }
}
