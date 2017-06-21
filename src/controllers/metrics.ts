import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import formatMetrics from '../helpers/formatMetrics';
import Redis from '../services/Redis';


async function getMetrics(ctx: Koa.Context) {
  return new Promise((resolve, reject) => {
      Redis.hgetall('smsgw_messages', (err, results) => {
      if (err) {
        ctx.status = 500;
        return;
      }

      ctx.body = formatMetrics(results);
      resolve();
    });
  });
}


export default function initialize(router: KoaRouter) {
  router.get('/metrics', getMetrics);
}
