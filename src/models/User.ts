import { hash, verify } from '../helpers/hash';

import Logger from '../services/Logger';
import Redis from '../services/Redis';
import Config from '../Config';
import { validate } from '../middleware/validation';


const newUserSchema = require('../schemas/NewUser.json');


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


export async function getAllUsers(): Promise<User[]> {
  return new Promise<User[]>((resolve, reject) => {
    Redis.hgetall('users', (err, results) => {
      if (err) {
        reject(err);
      }

      const users: User[] = [];

      Object.keys(results).forEach((username) => {
        users.push(JSON.parse(results[username]));
      });

      resolve(users);
    });
  });
}


export async function removeUserByUsername(username: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Redis.hdel('users', username, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}


/**
 * Removes all users. Exercise caution.
 */
export async function clearUsers(): Promise<void> {
  Logger.debug('Deleting all users :)');
  return new Promise<void>((resolve, reject) => {
    Redis.del('users', (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}


export async function ensureUser(newUser: NewUser): Promise<User> {
  validate(newUser, newUserSchema);

  Logger.debug('Ensuring user exists:', newUser.username);

  const salted = await hash(newUser.password);
  const user: User = {
    username: newUser.username,
    roles: newUser.roles,
    passwordHash: salted.hash,
    passwordSalt: salted.salt,
  };

  await new Promise<User>((resolve, reject) => {
    Redis.hsetnx('users', user.username, JSON.stringify(user), (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(user);
    });
  });

  // if it existed already, be sure to return the data we have in db
  return getUserByUsername(newUser.username);
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


export function ensureInitialUsers(config: Config = Config) {
  return Promise.all(config.initialUsers.map(ensureUser));
}


if (typeof beforeEach !== 'undefined') {
  Logger.debug('Users will be reset to testUsers in beforeEach');
  beforeEach(async () => {
    await clearUsers();
    await ensureTestUsers();
  });
}
