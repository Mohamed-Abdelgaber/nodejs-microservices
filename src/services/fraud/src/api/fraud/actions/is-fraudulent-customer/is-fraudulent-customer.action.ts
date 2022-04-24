import { FraudCheckService } from '@core/fraud-check.service';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  fraudCheckService: FraudCheckService;
  tracer: Tracer;
}

export const isFraudulentCustomerActionValidation = celebrate({
  [Segments.PARAMS]: {
    customerId: Joi.string().required(),
  },
});

export const wait = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

const isFraudulentCustomerAction =
  ({ fraudCheckService, tracer }: Dependencies): RequestHandler =>
  async (req, res, next) => {
    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    const span = tracer.startSpan('Check if customer is Fraudulent', {
      childOf: ctx,
    });

    span.addTags({
      'x-type': 'action',
    });

    // await wait(2000);

    span.finish();

    return fraudCheckService
      .isFraudulentCustomer(req.params.customerId)
      .then((isFraudulent) =>
        res.status(200).json({
          isFraudulent,
        }),
      )
      .catch(next);
  };

export default isFraudulentCustomerAction;
