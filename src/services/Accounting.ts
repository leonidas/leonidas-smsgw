import SMSMessage from '../models/SMSMessage';
import Logger from '../services/Logger';
import Redis from '../services/Redis';
import Config from '../Config';


export async function recordMessage(message: SMSMessage) {
  const customer = message.customer || Config.defaultCustomer;

  Logger.debug('recordMessage', message);
  Redis.hincrby('smsgw_messages', customer, message.recipients.length);
}
