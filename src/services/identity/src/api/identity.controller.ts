import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { registerNewAccountActionValidation } from './actions/register-new-account.action';
import { verifyEmailAddressActionValidation } from './actions/verify-email-address.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
  verifyEmailAddressAction: RequestHandler;
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

    router.patch('/verify-email', [
      verifyEmailAddressActionValidation,
      this.dependencies.verifyEmailAddressAction,
    ]);

    return router;
  }
}
