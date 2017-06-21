import * as supertest from 'supertest';
import { start } from '..';


export const message = {
  customer: 'leonidas.platform',
  message: 'Hello, World!',
  recipient: '+3585551235',
  sender: '+3585551234',
};


// tslint:disable-next-line:no-any
export function send(body: any): any {
  return request()
    .post('/api/v1/messages')
    .set('Content-Type', 'application/json')
    .send(body);
}


// tslint:disable-next-line:no-any
let server: any = null;

export function getServer() {
  if (!server) {
    server = start();
  }

  return server;
}


export function request() {
  return supertest(getServer());
}
