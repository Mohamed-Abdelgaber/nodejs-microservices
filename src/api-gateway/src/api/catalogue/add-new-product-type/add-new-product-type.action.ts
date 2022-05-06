import { ServiceClient } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  serviceClient: ServiceClient;
  tracingMiddleware: RequestHandler;
}

const addNewProductTypeActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().trim().required(),
  }),
});

const addNewProductTypeAction = ({
  serviceClient,
  tracingMiddleware,
}: Dependencies): RequestHandler[] => [
  tracingMiddleware,
  addNewProductTypeActionValidation,
  async (req, res, next) =>
    serviceClient
      .send('catalogue.add_new_product', req.body, {
        requestHeaders: req.headers,
      })
      .then((productType) => res.status(201).json(productType))
      .catch(next),
];

export default addNewProductTypeAction;
