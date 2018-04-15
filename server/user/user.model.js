const roleTypes = require('../utils/roletypes');
const { validateString, validateStrArray } = require('../utils/validators');
const constants = require('../utils/constants');
const BaseModel = require('../base/base.model');

class User extends BaseModel {
  constructor(username, roles, salt, hashedPass) {
    super();

    validateString({
      input: username,
      errorMessage: 'Невалидно потребителско име',
      checkLowerCase: true,
      minLen: constants.MIN_USERNAME_LEN,
      maxLen: constants.MAX_USERNAME_LEN,
    });

    validateStrArray({
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
