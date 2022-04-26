import { KraterError } from './krater.error';

export class UnauthenticatedError extends KraterError {
  constructor(message = 'Unauthenticated.') {
    super(message, 'UnauthenticatedError', 403);
  }
}
