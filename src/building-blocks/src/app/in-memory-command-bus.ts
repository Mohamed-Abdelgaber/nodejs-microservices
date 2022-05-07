import { KraterError } from '@errors/krater.error';
import { Tracer } from 'opentracing';
import { Command } from './command';
import { CommandBus, CommandContext } from './command-bus';
import { CommandHandler } from './command-handler';

interface CommandHandlers {
  [key: string]: CommandHandler<any, any>;
}

interface Dependencies {
  commandHandlers: CommandHandler<any, any>[];
  tracer: Tracer;
}

export class InMemoryCommandBus implements CommandBus {
  private existingCommandHandlers: CommandHandlers = {};

  constructor(private readonly dependencies: Dependencies) {
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

  public async handle(command: Command<any>, { context }: CommandContext): Promise<unknown> {
    const { tracer } = this.dependencies;

    const span = tracer.startSpan(
      `[Command Bus] Handling command${command.constructor.name.replace(/([A-Z])/g, ' $1')}.`,
      {
        childOf: context,
      },
    );

    span.addTags({
      'x-type': 'command',
    });

    const existingCommandHandler =
      this.existingCommandHandlers[this.getCommandHandlerName(command)];

    if (!existingCommandHandler) {
      span.finish();

      throw new KraterError(
        `Command Handler for command: "${this.getConstructorName(command)}" does not exist.`,
      );
    }

    const result = await existingCommandHandler.handle(command, {
      spanContext: span.context(),
    });

    span.finish();

    return result;
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getCommandHandlerName(command: Command<any>) {
    return `${this.getConstructorName(command)}Handler`;
  }
}
