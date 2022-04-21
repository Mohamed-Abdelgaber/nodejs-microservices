import { AppError } from '@errors/app.error';
import { Command } from './command';
import { CommandBus } from './command-bus';
import { CommandHandler } from './command-handler';

interface CommandHandlers {
  [key: string]: CommandHandler<any, any>;
}

interface Dependencies {
  commandHandlers: CommandHandler<any, any>[];
}

export class InMemoryCommandBus implements CommandBus {
  private existingCommandHandlers: CommandHandlers = {};

  constructor(dependencies: Dependencies) {
    this.existingCommandHandlers = dependencies.commandHandlers.reduce(
      (commandHandlers: CommandHandlers, currentHandler: CommandHandler<any, any>) => {
        return {
          ...commandHandlers,
          [this.getConstructorName(currentHandler)]: currentHandler,
        };
      },
      {},
    );
  }

  public async handle(command: Command<any>): Promise<unknown> {
    const existingCommandHandler =
      this.existingCommandHandlers[this.getCommandHandlerName(command)];

    if (!existingCommandHandler) {
      throw new AppError(
        `Command Handler for command: "${this.getConstructorName(command)}" does not exist.`,
      );
    }

    return existingCommandHandler.handle(command, {
      spanContext: {
        toSpanId: () => '',
        toTraceId: () => '',
      },
    });
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getCommandHandlerName(command: Command<any>) {
    return `${this.getConstructorName(command)}Handler`;
  }
}
