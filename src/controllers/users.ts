import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

// import Config from '../Config';
// import Redis from '../services/Redis';
import { basicAuthRequired, roleRequired } from '../middleware/authentication';
import { NewUser } from '../models/User';



async function createUser(ctx: Koa.Context) {
  const newUser: NewUser = ctx.body;

  await ensureUser(newUser);
}


async function getUsers(ctx: Koa.Context) {

}


async function getUser(ctx: Koa.Context) {

}


async function removeUser(ctx: Koa.Context) {

}


export default function initialize(router: KoaRouter) {
  router.post(
    'createUser',
    '/api/v1/users',
    basicAuthRequired(),
    roleRequired('admin'),
    createUser,
  );

  router.get(
    'getUser',
    '/api/v1/users',
    basicAuthRequired(),
    roleRequired('admin'),
    getUsers,
  );

  router.get(
    'getUser',
    '/api/v1/users/:username',
    basicAuthRequired(),
    roleRequired('admin'),
    getUser,
  );


  router.delete(
    'removeUser',
    '/api/v1/users',
    basicAuthRequired(),
    roleRequired('admin'),
    removeUser,
  );
}
