const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const settings = require('../config/settings');

const getSalt = () => {
  const salt = crypto.randomBytes(128).toString('base64');
  return salt;
};

const getHash = (salt, password) => {
  if (!salt || !password) {
    return null;
  }

  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)
    .digest('hex');

  return hash;
};

const getToken = (data, secret, expiration) =>
  jwt.sign(data, secret, {
    expiresIn: expiration,
    algorithm: 'HS512',
  });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, settings.secret, { algorithms: ['HS512'] });
  } catch (err) {
    return null;
  }
};

module.exports = {
  getSalt,
  getHash,
  getToken,
  verifyToken,
};
