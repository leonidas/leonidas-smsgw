import * as winston from 'winston';

// TODO: find a way to get types for these and re-enable noImplicitAny in tsconfig.json
import * as koaRequestLogger from 'koa-request-logger';
import * as consoleFormatter from 'winston-console-formatter';

import Config from '../Config';


type Logger = winston.LoggerInstance;


export function makeLogger(level: winston.CLILoggingLevel = Config.logLevel): Logger {
  const newLogger = new winston.Logger({ level });

  newLogger.add(winston.transports.Console, consoleFormatter.config());

  return newLogger;
}


export function makeRequestLogger(logger: winston.LoggerInstance, method: winston.CLILoggingLevel = 'info') {
  return koaRequestLogger({
    logger,
    method,
  });
}


const Logger = makeLogger();
export const requestLogger = makeRequestLogger(Logger);

export default Logger;
