import { KraterError } from '@errors/krater.error';

export class NotFoundError extends KraterError {
  constructor(message = 'Not Found.') {
    super(message, 'NotFoundError', 422);
  }
}
