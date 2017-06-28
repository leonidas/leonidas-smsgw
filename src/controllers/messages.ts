import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import isValidCustomer from '../helpers/isValidCustomer';
import { validate } from '../middleware/validation';
import SMSMessage from '../models/SMSMessage';
import Result from '../models/Result';
import { recordMessage } from '../services/Accounting';
import { sendMessage } from '../services/Messaging';
import Config from '../Config';
import { basicAuthRequired, roleRequired } from '../middleware/authentication';

const messageSchema = require('../schemas/SMSMessage.json');


export async function postMessage(ctx: Koa.Context) {
  validate(ctx.request.body, messageSchema);

  const message: SMSMessage = ctx.request.body;

  if (!message.customer) {
    message.customer = Config.defaultCustomer;
  } else if (!isValidCustomer(message.customer)) {
    ctx.status = 400;
    ctx.body = { code: 400, message: 'Invalid customer ID' };
    return;
  }

  let result: Result;
  try {
    result = await sendMessage(message);
  } catch (err) {
    // TODO better general error reporting
    ctx.status = 500;
    ctx.body = { success: false, recipients: [] };
    return;
  }

  await recordMessage(message);

  // TODO other result code than 207 for "all failed"
  ctx.body = result;
  ctx.status = result.success ? 201 : 207;
}


export default function initialize(router: KoaRouter) {
  router.post(
    'postMessage',
    '/api/v1/messages',
    basicAuthRequired(),
    roleRequired('send'),
    postMessage
  );
}
