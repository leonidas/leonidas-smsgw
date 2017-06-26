import * as querystring from 'querystring';

import Config from '../../Config';
import Result, { RecipientResult } from '../../models/Result';
import SMSMessage from '../../models/SMSMessage';


const config = Config.backends.labyrintti;
const resultRegex = /^(.+?) (OK|ERROR) (.+)$/;


export function handleResultLine(line: string): RecipientResult {
  const regexResult = resultRegex.exec(line.trim());
  if (!regexResult) {
    return {
      recipient: '',
      success: false,
      statusMessage: 'Unparseable result line.',
    };
  }

  return {
    recipient: regexResult[1],
    success: regexResult[2] === 'OK',
    statusMessage: regexResult[3],
  };
}


export default async function sendMessage(message: SMSMessage): Promise<Result> {
  const form = {
    password: config.password,
    user: config.username,
  };

  const url = `${config.baseUrl}/sendsms`;

  const options = {
    method: 'POST',
    body: querystring.stringify(form),
  };

  const response = await fetch(url, options);
  const result = await response.text();

  const recipients = result.split('\n').map(handleResultLine);

  return {
    success: recipients.every((item) => item.success),
    recipients,
  };
}
