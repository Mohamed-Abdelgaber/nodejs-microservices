import { KraterError } from '@krater/building-blocks';

export class ProductTypeStatusNotSupported extends KraterError {
  constructor(message = 'Provided Product Type Status is not supported.') {
    super(message, 'ProductTypeStatusNotSupported', 422);
  }
}
