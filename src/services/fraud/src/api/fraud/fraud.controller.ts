import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { isFraudulentCustomerActionValidation } from './actions/is-fraudulent-customer/is-fraudulent-customer.action';

interface Dependencies {
  isFraudulentCustomerAction: RequestHandler;
}

export class FraudController implements Controller {
  public readonly route = '/api/v1/fraud-check';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/:customerId', [
      isFraudulentCustomerActionValidation,
      this.dependencies.isFraudulentCustomerAction,
    ]);

    return router;
  }
}
