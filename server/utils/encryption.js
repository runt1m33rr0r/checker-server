const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const settings = require('../config/settings');

function getSalt() {
  const salt = crypto.randomBytes(128).toString('base64');
  return salt;
}

function getHash(salt, password) {
  if (!salt || !password) {
    return null;
  }

  const hash = crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  return hash;
}

function getToken(data, secret, expiration) {
  return jwt.sign(data, secret, {
    expiresIn: expiration,
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, settings.secret);
  } catch (err) {
    return null;
  }
}

module.exports = {
  getSalt,
  getHash,
  getToken,
  verifyToken,
};
