import { hash, verify } from '../helpers/hash';

import Logger from '../services/Logger';
import Redis from '../services/Redis';

export interface User {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  roles: string[];
}

export default User;


export interface NewUser {
  username: string;
  password: string;
  roles: string[];
}


export class UsernameOrPasswordWrong extends Error {
  public readonly username: string;

  constructor(username: string) {
    super(`Username or password wrong: ${username}`);
    this.username = username;

    // tslint:disable-next-line:max-line-length
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UsernameOrPasswordWrong.prototype);
  }
}


export function getUserByUsername(username: string): Promise<User> {
  return new Promise((resolve, reject) => {
    Redis.hget('users', username, (err, userJson) => {
      if (err) {
        Logger.warn('Redis error occurred while getting user:', username, err);
        reject(err);
      }

      if (!userJson) {
        Logger.warn('User not found:', username);
        reject(new UsernameOrPasswordWrong(username));
      }

      const user: User = JSON.parse(userJson);

      resolve(user);
    });
  });

}


/**
 * Gets a user for login purposes.
 *
 * @throws UsernameOrPasswordWrong
 */
export async function getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
  const user = await getUserByUsername(username);
  const verified = await verify(password, user.passwordHash, user.passwordSalt);
  if (!verified) {
    throw new UsernameOrPasswordWrong(username);
  }

  return user;
}


export async function ensureUser(newUser: NewUser) {
  Logger.debug('Ensuring user exists:', newUser.username);

  const salted = await hash(newUser.password);
  const user: User = {
    username: newUser.username,
    roles: newUser.roles,
    passwordHash: salted.hash,
    passwordSalt: salted.salt,
  };

  return new Promise((resolve, reject) => {
    Redis.hsetnx('users', user.username, JSON.stringify(user), (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}


export const testUsers = {
  admin: {
    username: 'admin',
    password: 'secret',
    roles: ['admin'],
  },
  prometheus: {
    username: 'prometheus',
    password: 'stealingthefire',
    roles: ['prometheus'],
  },
  user: {
    username: 'user',
    password: 'password',
    roles: ['send'],
  },
};


export function ensureTestUsers() {
  return Promise.all(
    Object.keys(testUsers)
      .map((username) => testUsers[username])
      .map(ensureUser)
  );
}
