// Want to know more?
// https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback

const crypto = require('crypto');
const {passwordHashing} = require('../../config');


// return true if success, return message string if failed
function checkPasswordFormat(password) {
  if (password.length <= 7)
    return 'At least 8 characters';

  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
  return re.test(password) ? true : 'At least one number, one lowercase and one uppercase letter';
}


/**
 * Encrypt(Hash) a password. Returns a hash and salt.
 * @param password
 * @returns {Promise<{hash: string, salt: string}>}
 */
async function hashPassword(password) {
  const {digest, hashSize, iterations, saltSize} = passwordHashing;
  const salt = crypto.randomBytes(saltSize);
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, hashSize, digest, (err, derivedKey) => {
      if (err) reject(err);
      resolve({
        hash: derivedKey.toString('base64'),
        salt: salt.toString('base64')
      })
    })
  })
}

/**
 * Given hash and salt, validate a password.
 * @param password
 * @param hash
 * @param salt
 * @returns {Promise<boolean>}
 */
async function validatePassword(password, hash, salt) {
  const {digest, hashSize, iterations, saltSize} = passwordHashing;
  salt = Buffer.from(salt, 'base64');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, hashSize, digest, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('base64') === hash)
    })
  })
}

module.exports = {hashPassword, validatePassword, checkPasswordFormat};
