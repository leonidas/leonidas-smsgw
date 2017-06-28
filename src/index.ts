import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as convert from 'koa-convert';
import * as session from 'koa-generic-session';
import * as passport from 'koa-passport';
import * as KoaRouter from 'koa-router';


import Config from './Config';
import router from './controllers';
import validationMiddleware from './middleware/validation';
import setupPassport from './middleware/authentication';
import Logger, { requestLogger } from './services/Logger';
import RedisStore from './services/RedisStore';


export type Context = Koa.Context & KoaRouter.IRouterContext & passport.Context;
export type Next = () => Promise<void>;


async function notFound(ctx: Context) {
  ctx.status = 404;
  ctx.body = { message: 'Not Found' };
}


export function makeApp(): Koa {
  const theApp = new Koa();
  theApp.keys = [Config.session.key];
  setupPassport();

  theApp.use(requestLogger);
  theApp.use(validationMiddleware);
  theApp.use(bodyParser());
  theApp.use(convert(session({
    store: RedisStore,
  })));
  theApp.use(passport.initialize());
  theApp.use(passport.session());
  theApp.use(router.routes());
  theApp.use(notFound);

  return theApp;
}


const app = makeApp();
export default app;


export function start(config: Config = Config) {
  const { address, port } = config.listen;

  Logger.info(`Starting smsgw at ${address}:${port}`, config);
  return app.listen(port, address);
}
