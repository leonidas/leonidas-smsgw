import SMSMessage from '../models/SMSMessage';
import Logger from '../services/Logger';
import Redis from '../services/Redis';


export async function recordMessage(message: SMSMessage) {
  Logger.debug('recordMessage', message);
  Redis.hincrby('smsgw_messages', message.customer, message.recipients.length);
}
