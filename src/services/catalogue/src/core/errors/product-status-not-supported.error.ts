import { KraterError } from '@krater/building-blocks';

export class ProductStatusNotSupportedError extends KraterError {
  constructor(message = 'Provided Product Status is not supported.') {
    super(message, 'ProductStatusNotSupportedError', 422);
  }
}
