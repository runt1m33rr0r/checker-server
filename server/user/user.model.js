const roleTypes = require('../utils/roletypes');

class User {
  constructor(username, roles, salt, hashedPass) {
    if (
      typeof username !== 'string' ||
      username.length < 5 ||
      username.length > 15 ||
      username !== username.toLowerCase()
    ) {
      throw new Error('Невалидни данни!');
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      throw new Error('Невалидни данни!');
    } else {
      roles.forEach((role) => {
        const types = Object.values(roleTypes);
        if (!types.includes(role)) {
          throw new Error('Невалидни данни!');
        }
      });
    }

    if (typeof salt !== 'string') {
      throw new Error('Невалидни данни!');
    }

    if (typeof hashedPass !== 'string') {
      throw new Error('Невалидни данни!');
    }

    this.username = username;
    this.hashedPass = hashedPass;
    this.salt = salt;
    this.roles = roles;
  }
}

module.exports = User;
