import { KraterError } from './krater.error';

export class BusinessRuleValidationError extends KraterError {
  constructor(message: string) {
    super(message, 'BusinessRuleValidationError', 400);
  }
}
