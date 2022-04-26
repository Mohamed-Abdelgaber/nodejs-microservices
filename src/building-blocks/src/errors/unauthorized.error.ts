import { KraterError } from './krater.error';

export class UnauthorizedError extends KraterError {
  constructor(message = 'Unauthorized.') {
    super(message, 'UnauthorizedError', 401);
  }
}
