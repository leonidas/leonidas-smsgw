import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

import Config from './Config';
import router from './controllers';
import validationMiddleware from './middleware/validation';
import Logger, { requestLogger } from './services/Logger';


export function makeApp(): Koa {
    const theApp = new Koa();

    theApp.use(requestLogger);
    theApp.use(validationMiddleware);
    theApp.use(bodyParser());
    theApp.use(router.routes());

    return theApp;
}


const app = makeApp();
export default app;


export function start(config: Config = Config) {
    const { address, port } = config.listen;

    Logger.info(`Starting smsgw at ${address}:${port}`, config);
    return app.listen(port, address);
}
