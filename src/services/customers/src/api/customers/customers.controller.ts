import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { createCustomerActionValidation } from './actions/create-customer.action';

interface Dependencies {
  createCustomerAction: RequestHandler;
}

export class CustomersController implements Controller {
  public readonly route = '/api/v1/customers';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/', [createCustomerActionValidation, this.dependencies.createCustomerAction]);

    return router;
  }
}
