const roleTypes = require('../utils/roletypes');
const { validateString, validateArray } = require('../utils/validators');

class User {
  constructor(username, roles, salt, hashedPass) {
    validateString({
      input: username,
      errorMessage: 'Невалидно потребителско име',
      checkLowerCase: true,
      minLen: 5,
      maxLen: 15,
    });

    validateArray({
      input: roles,
      errorMessage: 'Невалидни роли!',
      contentType: 'string',
      acceptableValues: Object.values(roleTypes),
    });

    validateString({ input: salt, errorMessage: 'Невалидни данни!' });
    validateString({ input: hashedPass, errorMessage: 'Невалидни данни!' });

    this.username = username;
    this.hashedPass = hashedPass;
    this.salt = salt;
    this.roles = roles;
  }
}

module.exports = User;
