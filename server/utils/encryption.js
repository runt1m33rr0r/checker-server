const crypto = require('crypto');

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

module.exports = {
    getSalt,
    getHash,
};