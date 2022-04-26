import { KraterError } from '@errors/krater.error';

export class InputValidationError extends KraterError {
  constructor(message = 'Input Validation Error.') {
    super(message, 'InputValidationError', 422);
  }
}
