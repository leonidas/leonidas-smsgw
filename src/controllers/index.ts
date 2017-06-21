import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import messages from './messages';
import metrics from './metrics';


export function getIndex(ctx: Koa.Context) {
  ctx.redirect('https://leonidasoy.fi/');
}


export function makeRouter(): KoaRouter {
  const router = new KoaRouter();

  router.get('index', '/', getIndex);

  messages(router);
  metrics(router);

  return router;
}


export default makeRouter();
