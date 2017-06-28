import * as supertest from 'supertest';
import { start } from '..';
import { testUsers, NewUser } from '../models/User';


export const message = {
  customer: 'leonidas.platform',
  message: 'Hello, World!',
  recipients: ['+3585551235'],
  sender: '+3585551234',
};


// tslint:disable-next-line:no-any
export function send(body: any, user: NewUser = testUsers.user): any {
  return request()
    .post('/api/v1/messages')
    .set('Content-Type', 'application/json')
    .auth(user.username, user.password)
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
