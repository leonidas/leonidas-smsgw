import SMSMessage from '../../models/SMSMessage';
import Logger from '../../services/Logger';


export let messages: SMSMessage[] = [];


export default async function sendMessage(message: SMSMessage) {
  Logger.debug('backends.mock.sendMessage', message);
  messages.push(message);
}


export function reset() {
  messages = [];
}


if (typeof beforeEach !== 'undefined') {
  Logger.debug('Setting up beforeEach hook to clear mock message backend');
  beforeEach(reset);
}
