import * as winston from 'winston';

import { NewUser } from './models/User';


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
    db: string;
  };
  nodeEnv: NodeEnv;
  logLevel: winston.CLILoggingLevel;

  session: {
    key: string;
  };

  /**
   * Initial admin user that will be created if it does not exist.
   * Note that the password will not be changed if it already exists.
   */
  initialUsers: NewUser[];
}


function makeConfig(env: typeof process.env = process.env): Config {
  const nodeEnv: NodeEnv = process.env.NODE_ENV || 'development';

  let sessionKey: string = process.env.SMSGW_SESSION_KEY || '';
  if (!sessionKey) {
    if (['development', 'test'].indexOf(nodeEnv) >= 0) {
      sessionKey = 'insecure development session key';
    } else {
      throw new Error('SMSGW_SESSION_KEY must be set in production environments');
    }
  }

  const initialUsers: NewUser[] = [
    {
      username: process.env.SMSGW_INITIAL_ADMIN_USERNAME || 'admin',
      password: process.env.SMSGW_INITIAL_ADMIN_PASSWORD,
      roles: ['admin'],
    },
    {
      username: process.env.SMSGW_INITIAL_PROMETHEUS_USERNAME || 'prometheus',
      password: process.env.SMSGW_INITIAL_PROMETHEUS_PASSWORD,
      roles: ['prometheus'],
    },
    {
      username: process.env.SMSGW_INITIAL_USER_USERNAME || 'leonidas',
      password: process.env.SMSGW_INITIAL_USER_PASSWORD,
      roles: ['send'],
    },
  ].filter((newUser) => newUser.password);

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
    },
    session: {
      key: sessionKey,
    },
    initialUsers,
  };
}


const Config = makeConfig();
export default Config;
