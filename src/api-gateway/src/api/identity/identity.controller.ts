import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  signUpAction: RequestHandler[];
}

export class IdentityController implements Controller {
  public readonly route = '/api/v1/identity';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/sign-up', this.dependencies.signUpAction);

    return router;
  }
}
