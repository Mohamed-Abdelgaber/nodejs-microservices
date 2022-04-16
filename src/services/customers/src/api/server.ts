import express, { Application } from 'express';
import { Controller, Logger } from '@krater/building-blocks';
import apiMetrics from 'prometheus-api-metrics';
import promClient from 'prom-client';

interface Dependencies {
  logger: Logger;
  controllers: Controller[];
}

export class Server {
  private app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    this.app.use(apiMetrics());

    const counter = new promClient.Counter({
      name: 'health_count',
      help: 'health count for customers ms',
    });

    this.app.get('/health', (_, res) => {
      counter.inc();
      res.sendStatus(200);
    });

    this.dependencies.controllers.forEach((controller) =>
      this.app.use(controller.route, controller.getRouter()),
    );
  }

  public getApp() {
    return this.app;
  }
}
