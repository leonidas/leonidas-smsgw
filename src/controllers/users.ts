import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

// import Config from '../Config';
// import Redis from '../services/Redis';
import { basicAuthRequired, roleRequired } from '../middleware/authentication';
import {
  NewUser,
  ensureUser,
  getAllUsers,
  getUserByUsername,
  removeUserByUsername,
} from '../models/User';


async function createUser(ctx: Koa.Context) {
  const newUser: NewUser = ctx.request.body;

  const user = await ensureUser(newUser);

  ctx.status = 201;
  ctx.body = {
    username: user.username,
    roles: user.roles,
  };
}


async function getUsers(ctx: Koa.Context) {
  const users = await getAllUsers();
  users.forEach((user) => {
    delete user.passwordHash;
    delete user.passwordSalt;
  });
  ctx.body = { users };
}


async function getUser(ctx: Koa.Context) {
  const user = await getUserByUsername(ctx.params.username);
  delete user.passwordHash;
  delete user.passwordSalt;
  ctx.body = user;
}


async function removeUser(ctx: Koa.Context) {
  await getUserByUsername(ctx.params.username);
  await removeUserByUsername(ctx.params.username);
  ctx.body = '';
  ctx.status = 204;
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
    '/api/v1/users/:username',
    basicAuthRequired(),
    roleRequired('admin'),
    removeUser,
  );
}
