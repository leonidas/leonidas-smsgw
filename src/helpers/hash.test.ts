import * as assert from 'assert';
import { hash, verify } from './hash';


describe('hashHelper', () => {
  describe('hash', () => {
    it('produces password hashes with a random salt', async function() {
      const hashed = await hash('kissa123');
      assert(typeof hashed.hash, 'string');
      assert.equal(hashed.hash.length, 64);
      assert(typeof hashed.salt, 'string');
      assert.equal(hashed.salt.length, 64);
    });
  });

  describe('verify', () => {
    it('checks password hashes produced by hash', async function() {
      const hashed = await hash('kissa123');
      assert(await verify('kissa123', hashed.hash, hashed.salt));
      assert(!(await verify('kissa124', hashed.hash, hashed.salt)));
    });
  });
});
