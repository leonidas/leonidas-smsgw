import * as passport from 'koa-passport';
import * as passportLocal from 'passport-local';
import * as passportHttp from 'passport-http';

import { Context, Next } from '..';
import User, { getUserByUsername, getUserByUsernameAndPassword, UsernameOrPasswordWrong } from '../models/User';
import Logger from '../services/Logger';

const LocalStrategy = passportLocal.Strategy;
const BasicStrategy = passportHttp.BasicStrategy;


type Done = (err: Error | null, user: User | false) => void;


async function handleAuth(username: string, password: string, done: Done) {
  Logger.debug('Login attempt with username', username);

  try {
    const user = await getUserByUsernameAndPassword(username, password);
    Logger.debug('Login successful', user);
    done(null, user);
  } catch (err) {
    if (err instanceof UsernameOrPasswordWrong) {
      Logger.warn('Username or password wrong');
      return done(null, false);
    } else {
      Logger.warn('Login failed due to other error', err);
      return done(err, false);
    }
  }
}


export default function setupPassport() {
  passport.use('local', new LocalStrategy(handleAuth));
  passport.use('basic', new BasicStrategy(handleAuth));

  passport.serializeUser((user: User, done) => done(null, user.username));

  passport.deserializeUser(async (username: string, done) => {
    try {
      const user = await getUserByUsername(username);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
}


export function basicAuthRequired() {
  return passport.authenticate('basic', { session: false });
}


export async function loginRequired(ctx: Context, next: Next) {
  if (ctx.isAuthenticated()) {
    Logger.debug('Allowing access to protected resource', ctx.path, 'for user', ctx.state.user.username);

    return await next();
  } else {
    Logger.warn('Unauthenticated access attempted at', ctx.path);
    ctx.status = 401;
    ctx.body = { message: 'Authentication required' };
  }
}


export function roleRequired(role: string) {
  return async (ctx: Context, next: Next) => {
    const user: User = ctx.state.user || {};
    const roles = user.roles || [];

    if (roles.indexOf(role) >= 0 || roles.indexOf('admin') >= 0) {
      Logger.debug(
        'Allowing access to protected resource', ctx.path,
        'for user', user.username,
        'with role', role
      );

      return await next();
    } else {
      Logger.warn(
        'Unauthorized access attempted at', ctx.path,
        'without required role', role
      );

      ctx.status = 401;
      ctx.body = { message: 'Authentication required' };
    }
  };
}
