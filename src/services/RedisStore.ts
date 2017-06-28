import * as redisStore from 'koa-redis';

import Config from '../Config';


// TODO reuse connection from ./Redis


// tslint:disable-next-line:no-empty-interface
interface RedisStore {}

function makeRedis(config: Config = Config): RedisStore {
  const { host, port } = Config.redis;
  const db = parseInt(Config.redis.db, 10);

  return redisStore({ host, port, db });
}

const RedisStore = makeRedis();

export default RedisStore;
