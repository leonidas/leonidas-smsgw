import * as winston from 'winston';


type NodeEnv = 'development' | 'production' | 'test';
type Backend = 'labyrintti' | 'mock';


export interface LabyrinttiConfig {
  baseUrl: string;
  username: string;
  password: string;
}


interface Config {
  backends: {
    labyrintti: LabyrinttiConfig;
  };

  defaultBackend: Backend;

  /**
   * At least this customer will always be present in the /metrics output.
   * It will also reap messages that do not specify the customer.
   */
  defaultCustomer: string;

  /**
   * Used as the sender number unless specified in the message.
   */
  defaultSender?: string;

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
    backends: {
      labyrintti: {
        baseUrl: process.env.SMSGW_LABYRINTTI_BASE_URL || 'https://gw.labyrintti.com:28443',
        password: process.env.SMSGW_LABYRINTTI_PASSWORD || 'testpassword',
        username: process.env.SMSGW_LABYRINTTI_USERNAME || 'testuser',
      },
    },
    defaultBackend: process.env.SMSGW_DEFAULT_BACKEND || 'mock',
    defaultCustomer: process.env.SMSGW_DEFAULT_CUSTOMER || 'leonidas',
    defaultSender: process.env.SMSGW_DEFAULT_SENDER,
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
