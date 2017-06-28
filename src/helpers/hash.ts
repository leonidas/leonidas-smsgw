import * as auth from 'passport-local-authenticate';


// NOTE changing any of these will invalidate all password hashes currently in the database
const options = {
  digestAlgorithm: 'sha256',
  keylen: 32, // 32 bytes, 64 hex digits, 256 bits
  saltlen: 32,
  iterations: 40000,
};


interface Salted {
  hash: string;
  salt: string;
}


/**
 * Hashes a password with pbkdf2-sha256. A random salt will be generated.
 *
 * @param {string} password - The password to create a hash for.
 * @returns {Promise<>} The `hash` and `salt`, both strings of length 64.
 */
export function hash(password: string): Promise<Salted> {
  return new Promise((resolve, reject) => {
    auth.hash(password, options, (err, hashed) => {
      if (err) {
        reject(err);
      }

      resolve(hashed);
    });
  });
}


/**
 * Verifies a password hash.
 *
 * @param password – The attempted password that is being checked.
 * @param hash – The hash of the correct password, of length 64.
 * @param salt – The salt the hash was created with, of length 64.
 * @returns `true` if the password matches the hash, `false` otherwise.
 */
export function verify(password: string, hash: string, salt: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    auth.verify(password, { hash, salt }, options, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}
