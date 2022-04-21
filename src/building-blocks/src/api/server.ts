import express, { Application } from 'express';
import { Controller } from './controller';
import apiMetrics from 'prometheus-api-metrics';
import status from 'http-status';

interface Dependencies {
  controllers: Controller[];
}

export class Server {
  private app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    this.app.use(apiMetrics());

    this.app.get('/health', (_, res) => {
      res.sendStatus(status.OK);
    });

    this.dependencies.controllers.forEach((controller) =>
      this.app.use(controller.route, controller.getRouter()),
    );
  }

  public getApp() {
    return this.app;
  }
}
