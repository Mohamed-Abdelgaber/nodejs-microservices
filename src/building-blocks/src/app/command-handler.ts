import { Command } from './command';
import { ServiceCommand } from './service-command';

export interface CommandHandler<
  CommandType extends Command<any> | ServiceCommand<any>,
  ResultType extends object | void = void,
> {
  handle(command: CommandType): Promise<ResultType>;
}
