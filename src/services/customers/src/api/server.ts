import express, { Application } from 'express';
import { Controller, Logger } from '@krater/building-blocks';
import apiMetrics from 'prometheus-api-metrics';

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

    this.app.get('/health', (_, res) => {
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
