import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  createNewProductAction: RequestHandler[];
}

export class CatalogueController implements Controller {
  public readonly route = '/api/v1/catalogue';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/products', this.dependencies.createNewProductAction);

    return router;
  }
}
