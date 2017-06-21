import * as redis from 'redis';

import Config from '../Config';
import Logger from '../services/Logger';


export function createClient(config: Config = Config): redis.RedisClient {
  return redis.createClient(config.redis);
}


type Redis = redis.RedisClient;
const Redis = createClient();
export default Redis;


if (typeof before !== 'undefined') {
  before((done) => {
    Redis.on('error', (err) => {
      Logger.error('Error while connecting to Redis', err);
      done(err);
    });
    Redis.on('ready', () => done());
  });
}

if (typeof beforeEach !== 'undefined') {
  Logger.debug('Setting up redis clear hook for testing');
  beforeEach((done) => Redis.del('smsgw_messages', (err, res) => done(err)) );
}
