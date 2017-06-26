import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import isValidCustomer from '../helpers/isValidCustomer';
import { validate } from '../middleware/validation';
import SMSMessage from '../models/SMSMessage';
import { recordMessage } from '../services/Accounting';
import { sendMessage } from '../services/Messaging';
import Config from '../Config';


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

  try {
    await sendMessage(message);
  } catch (err) {
    ctx.status = 500;
    ctx.body = { code: 500, message: 'Failed to send' };
    return;
  }

  await recordMessage(message);

  ctx.body = { code: 200, message: 'Message sent successfully' };
}


export default function initialize(router: KoaRouter) {
  router.post('/api/v1/messages', postMessage);
}
