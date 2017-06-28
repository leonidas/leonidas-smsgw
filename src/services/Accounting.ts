import SMSMessage from '../models/SMSMessage';
import Logger from '../services/Logger';
import Redis from '../services/Redis';
import Config from '../Config';


export async function recordMessage(message: SMSMessage) {
  const customer = message.customer || Config.defaultCustomer;

  Logger.debug('recordMessage', message);
  Redis.hincrby('smsgw_messages', customer, message.recipients.length);
}


if (typeof beforeEach !== 'undefined') {
  Logger.debug('smsgw_messages will be cleared in Redis in beforeEach');
  beforeEach((done) => Redis.del('smsgw_messages', (err, res) => done(err)) );
}
