import { Controller } from '@krater/building-blocks';
import { Router } from 'express';
import proxy from 'express-http-proxy';

export class CustomersController implements Controller {
  public readonly route = '/api/v1/customers';

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/',
      (req, res, next) => {
        if (req.headers['authorization'] === 'admin') {
          return next();
        }

        return res.sendStatus(401);
      },
      proxy('localhost:4000', {
        proxyReqPathResolver: () => '/api/v1/customers',
      }),
    );

    return router;
  }
}
