import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { registerNewAccountActionValidation } from './actions/register-new-account.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
}

export class IdentityController implements Controller {
  public readonly route = '/';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/sign-up', [
      registerNewAccountActionValidation,
      this.dependencies.registerNewAccountAction,
    ]);

    return router;
  }
}
