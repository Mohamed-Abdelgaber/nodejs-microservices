import * as Winston from 'winston';
import { SeqTransport } from '@datalust/winston-seq';

export interface Logger {
  log: LogMethod;
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  verbose: LeveledLogMethod;
  debug: LeveledLogMethod;
}

export type LogMethod = (level: string, message: string) => Logger;

export type LeveledLogMethod = (message: string, error?: unknown) => Logger;

const logFormat = Winston.format.printf(
  ({ level, message }) => `${new Date().toISOString()} | [${level}]: ${message}`,
);

export const logger: Logger = Winston.createLogger({
  level: process.env.LOGGING_LEVEL ?? 'debug',
  silent: process.env.ENV === 'test',
  format: Winston.format.combine(
    Winston.format.colorize(),
    Winston.format.splat(),
    Winston.format.align(),
    logFormat,
  ),
  transports: [
    new Winston.transports.Console(),
    new SeqTransport({
      serverUrl: 'http://127.0.0.1:5341',
      apiKey: 'O8lyxdRwWgOwlWLgvbid',
      onError: (e) => console.error(e),
      format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.splat(),
        Winston.format.align(),
        logFormat,
      ),
    }),
  ],
});
