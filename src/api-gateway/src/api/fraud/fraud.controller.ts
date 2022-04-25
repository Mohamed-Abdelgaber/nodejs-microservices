import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  isFraudulentCustomerAction: RequestHandler;
}

export class FraudController implements Controller {
  public readonly route = '/api/v1/fraud';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/fraud-check/:customerId', this.dependencies.isFraudulentCustomerAction);

    return router;
  }
}
