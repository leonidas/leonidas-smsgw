import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import Config from '../Config';
import formatMetrics from '../helpers/formatMetrics';
import Redis from '../services/Redis';
import { basicAuthRequired, roleRequired } from '../middleware/authentication';


async function getMetrics(ctx: Koa.Context) {
  return new Promise((resolve, reject) => {
      Redis.hgetall('smsgw_messages', (err, rawResults) => {
      if (err) {
        ctx.status = 500;
        return;
      }

      // make sure there is always at least one metric
      const results = Object.assign({ [Config.defaultCustomer]: 0 }, rawResults);

      ctx.body = formatMetrics(results);
      resolve();
    });
  });
}


export default function initialize(router: KoaRouter) {
  router.get(
    'getMetrics',
    '/metrics',
    basicAuthRequired(),
    roleRequired('prometheus'),
    getMetrics
  );
}
