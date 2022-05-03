import { TokenProviderService, UnauthorizedError } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  tokenProviderService: TokenProviderService;
}

export const authMiddleware =
  ({ tokenProviderService }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const token = req.headers['x-auth-token'] ? req.headers['x-auth-token'].slice(7) : null;

    if (!token) {
      return next(new UnauthorizedError());
    }

    const { accountId } = tokenProviderService.verifyAndDecodeToken<{ accountId: string }>(
      token as string,
      'secret',
    );

    if (!accountId) {
      return next(new UnauthorizedError());
    }

    res.locals.accountId = accountId;

    next();
  };
