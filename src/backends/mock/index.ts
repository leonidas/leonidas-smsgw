import Result from '../../models/Result';
import SMSMessage from '../../models/SMSMessage';
import Logger from '../../services/Logger';


export let messages: SMSMessage[] = [];


export default async function sendMessage(message: SMSMessage): Promise<Result> {
  Logger.debug('backends.mock.sendMessage', message);
  messages.push(message);

  return {
    success: true,
    recipients: message.recipients.map((recipient) => ({
      recipient,
      success: true,
      message: 'The mock backend always reports success regardless of recipient.',
    })),
  };
}


export function reset() {
  messages = [];
}


if (typeof beforeEach !== 'undefined') {
  Logger.debug('Setting up beforeEach hook to clear mock message backend');
  beforeEach(reset);
}
