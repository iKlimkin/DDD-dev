'use strict';

const crypto = require('node:crypto');

const hash = (password) => {
  const salt = crypto.randomBytes(16).toString('base64');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, result) => {
      if (err) reject(err);
      resolve(salt + ':' + result.toString('base64'));
    });
  });
};

const verify = (pass, hashStr) =>
  new Promise((resolve, reject) => {
    if (!hashStr || !hashStr.includes(':')) {
      resolve(false);
      return;
    }
    const [salt, hash] = hashStr.split(':');
    if (!salt || !hash) {
      resolve(false);
      return;
    }
    crypto.scrypt(pass, salt, 64, (err, res) => {
      if (err) reject(err);
      resolve(res.toString('base64') === hash);
    });
  });

module.exports = { hash, verify };
