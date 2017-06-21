import * as winston from 'winston';


type NodeEnv = 'development' | 'production' | 'test';
type Backend = 'labyrintti' | 'mock';


interface Config {
  backend: Backend,
  listen: {
    port: number;
    address: string;
  };
  redis: {
    host: string;
    port: number;
    prefix: string;
    db?: string;
  };
  nodeEnv: NodeEnv;
  logLevel: winston.CLILoggingLevel;
}


function makeConfig(env: typeof process.env = process.env): Config {
  const nodeEnv: NodeEnv = process.env.NODE_ENV || 'development';

  return {
    backend: process.env.SMSGW_BACKEND || 'mock',
    listen: {
      address: process.env.SMSGW_LISTEN_ADDRESS || '127.0.0.1',
      port: parseInt(process.env.SMSGW_LISTEN_PORT || '3000', 10),
    },
    logLevel: process.env.SMSGW_LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
    nodeEnv,
    redis: {
      db: process.env.SMSGW_REDIS_DB || '0',
      host: process.env.SMSGW_REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.SMSGW_REDIS_PORT || 6379, 10),
      prefix: process.env.SMSGW_REDIS_PREFIX || 'smsgw',
    }
  };
}


const Config = makeConfig();
export default Config;
