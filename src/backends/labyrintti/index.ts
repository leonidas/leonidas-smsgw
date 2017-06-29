import * as querystring from 'querystring';
import fetch from 'node-fetch';

import Config from '../../Config';
import Logger from '../../services/Logger';
import Result, { RecipientResult } from '../../models/Result';
import SMSMessage from '../../models/SMSMessage';


const labyrintti = Config.backends.labyrintti;
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


export function makeFetchOptions(message: SMSMessage): RequestInit {
  const form = {
    password: labyrintti.password,
    user: labyrintti.username,
    dests: message.recipients.join(','),
    text: message.message,
    source: message.sender || Config.defaultSender,
  };

  const body = querystring.stringify(form);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': body.length.toString(),
  };

  return {
    body,
    headers,
    method: 'POST',
    redirect: 'error',
  };
}


export default async function sendMessage(message: SMSMessage): Promise<Result> {
  const url = `${labyrintti.baseUrl}/sendsms`;
  const options = makeFetchOptions(message);

  Logger.debug('labyrintti backend request', url, options);

  const response = await fetch(url, options);
  const result = await response.text();

  Logger.debug('labyrintti backend response', result);

  const recipients = result.trim().split('\n').map(handleResultLine);

  return {
    success: recipients.every((item) => item.success),
    recipients,
  };
}
