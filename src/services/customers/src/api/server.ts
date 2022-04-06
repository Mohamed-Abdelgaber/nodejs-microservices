import express, { Application } from 'express';
import { Controller, Logger } from '@krater/building-blocks';

interface Dependencies {
  logger: Logger;
  controllers: Controller[];
}

export class Server {
  private app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    this.app.get('/', (_, res) => {
      this.dependencies.logger.info('Hit customers');

      res.status(200).send({
        message: 'Hello from customers ms',
      });
    });

    this.dependencies.controllers.forEach((controller) =>
      this.app.use(controller.route, controller.getRouter()),
    );
  }

  public getApp() {
    return this.app;
  }
}