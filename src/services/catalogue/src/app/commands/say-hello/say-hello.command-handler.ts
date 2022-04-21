import { CommandHandler, Logger } from '@krater/building-blocks';
import { SayHelloCommand } from './say-hello.command';

interface Dependencies {
  logger: Logger;
}

export class SayHelloCommandHandler implements CommandHandler<SayHelloCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: SayHelloCommand): Promise<void> {
    this.dependencies.logger.info(`[Catalogue MS] - ${command.payload.message}`);
  }
}
