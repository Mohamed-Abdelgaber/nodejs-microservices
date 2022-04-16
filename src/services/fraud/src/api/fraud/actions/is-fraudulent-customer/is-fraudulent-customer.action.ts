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

const isFraudulentCustomerAction =
  ({ fraudCheckService, tracer }: Dependencies): RequestHandler =>
  async (req, res, next) => {
    const ctx = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    const span = tracer.startSpan('Check if customer is Fraudulent', {
      childOf: ctx,
    });

    span.log({
      msg: '#test',
    });

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
