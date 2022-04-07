import { Controller } from '@krater/building-blocks';
import { Router } from 'express';

export class FraudController implements Controller {
  public readonly route = '/api/v1/fraud';

  public getRouter(): Router {
    const router = Router();

    router.get('/', (_, res) =>
      res.status(200).json({
        message: 'Hello from Fraud MS',
      }),
    );

    return router;
  }
}
