import * as assert from 'assert';

import { User, UsernameOrPasswordWrong, testUsers, getUserByUsername } from '../models/User';
import { request } from '../helpers/test';

describe('/api/v1/users', () => {
  describe('POST', () => {
    it('creates a new user', async () => {
      await request()
        .post('/api/v1/users')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .send({
          username: 'newUser',
          password: 'thePassword',
          roles: ['send'],
        })
        .expect(201);

      const user = await getUserByUsername('newUser');
      assert.equal(user.username, 'newUser');
      assert(user.passwordHash);
      assert(user.passwordSalt);
      assert.deepEqual(user.roles, ['send']);
    });

    it('validates its input', () =>
      request()
        .post('/api/v1/users')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .send({
          password: 'thePassword',
          roles: ['send'],
        })
        .expect(400)
      );
  });

  describe('GET', () => {
    it('returns a list of users', async () => {
      const response = await request()
        .get('/api/v1/users')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .expect(200);

      const users: User[] = response.body.users;
      assert.equal(users.length, 3);

      // known test users
      Object.keys(testUsers).forEach((username) => {
        assert(users.find((user) => user.username === username), username);
      });
    });

    it('does not contain password hashes', async () => {
      const response = await request()
        .get('/api/v1/users')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .expect(200);

      const users: User[] = response.body.users;
      users.forEach((user) => {
        assert(!user.passwordHash, 'passwordHash');
        assert(!user.passwordSalt, 'passwordSalt');
      });
    });
  });
});

describe('/api/v1/users/:username', () => {
  describe('GET', () => {
    it('returns user info', async () => {
      const response = await request()
        .get('/api/v1/users/prometheus')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .expect(200);

      const user: User = response.body;
      assert.equal(user.username, 'prometheus');
      assert.deepEqual(user.roles, ['prometheus']);
    });

    it('does not contain password hashes', async () => {
      const response = await request()
        .get('/api/v1/users/admin')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .expect(200);

      const user: User = response.body;
      assert(!user.passwordHash, 'passwordHash');
      assert(!user.passwordSalt, 'passwordSalt');
    });
  });

  describe('DELETE', () => {
    it('deletes a user', async () => {
      await request()
        .delete('/api/v1/users/prometheus')
        .auth(testUsers.admin.username, testUsers.admin.password)
        .expect(204);

      try {
        await getUserByUsername('prometheus');
      } catch (err) {
        // TODO exception name does not match this use case
        if (err instanceof UsernameOrPasswordWrong) {
          return;
        } else {
          throw new Error('wrong exception type');
        }
      }

      throw new Error('did not throw');
    });
  });
});
