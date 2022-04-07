import { FraudCheckService } from '@core/fraud-check.service';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  fraudCheckService: FraudCheckService;
}

export const isFraudulentCustomerActionValidation = celebrate({
  [Segments.PARAMS]: {
    customerId: Joi.string().required(),
  },
});

const isFraudulentCustomerAction =
  ({ fraudCheckService }: Dependencies): RequestHandler =>
  (req, res, next) =>
    fraudCheckService
      .isFraudulentCustomer(req.params.customerId)
      .then((isFraudulent) =>
        res.status(200).json({
          isFraudulent,
        }),
      )
      .catch(next);

export default isFraudulentCustomerAction;
