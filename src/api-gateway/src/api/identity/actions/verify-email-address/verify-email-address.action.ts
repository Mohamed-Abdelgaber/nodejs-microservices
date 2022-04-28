import { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

interface Dependencies {
  tracingMiddleware: RequestHandler;
}

const verifyEmailAddressAction = ({ tracingMiddleware }: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  proxy('localhost:5100', {
    proxyReqPathResolver: () => '/verify-email',
  }),
];

export default verifyEmailAddressAction;
