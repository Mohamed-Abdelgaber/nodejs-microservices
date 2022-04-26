import { KraterError } from './krater.error';

export class ResourceAlreadyExistsError extends KraterError {
  constructor(message = 'Resource Already Exists.') {
    super(message, 'ResourceAlreadyExistsError', 409);
  }
}
