/* eslint-disable import/first */
require('dotenv').config();

import { Logger, MessageBus, ServiceDiscovery, TracerBuilder } from '@krater/building-blocks';
import { Application } from 'express';
import Vault from 'node-vault';
import * as opentracing from 'opentracing';
import { container } from './container';

(async () => {
  const appContainer = container();

  const app = appContainer.resolve<Application>('app');
  const logger = appContainer.resolve<Logger>('logger');

  const serviceDiscovery = appContainer.resolve<ServiceDiscovery>('serviceDiscovery');

  const messageBus = appContainer.resolve<MessageBus>('messageBus');

  await messageBus.init();

  const PORT = process.env.APP_PORT ?? 4000;

  const vault = Vault({
    endpoint: 'http://127.0.0.1:8200',
    apiVersion: 'v1',
  });

  // const result = await vault.approleLogin({
  //   role_id: process.env.ROLE_ID,
  //   secret_id: process.env.SECRET_ID,
  // });

  vault.token = 'secret';

  // const { data } = await vault.read('secret/data/customers-service/config', {});

  app.listen(PORT, async () => {
    logger.info(`Customers MS listening on http://localhost:${PORT}`);

    const tracerBuilder = new TracerBuilder('customers').build();

    opentracing.initGlobalTracer(tracerBuilder);

    const tracer = opentracing.globalTracer();

    const span = tracer.startSpan('do_something');

    span.setTag('alpha', '200');
    span.setTag('beta', '50');
    span.log({ state: 'waiting' });

    const otherSpan = tracer.startSpan('nice', {
      childOf: span.context(),
    });

    span.finish();

    otherSpan.log({
      state: 'progress',
    });
    otherSpan.finish();

    await serviceDiscovery.registerService({
      address: '127.0.0.1',
      port: Number(PORT),
      name: 'customers',
      health: {
        endpoint: '/health',
        intervalSeconds: 30,
        timeoutSeconds: 5,
      },
    });
  });
})();
