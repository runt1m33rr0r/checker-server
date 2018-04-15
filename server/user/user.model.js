const roleTypes = require('../utils/roletypes');
const { validateString, validateStrArray } = require('../utils/validators');
const constants = require('../utils/constants');
const BaseModel = require('../base/base.model');

class User extends BaseModel {
  constructor(username, roles, salt, hashedPass) {
    super();

    this.username = username;
    this.hashedPass = hashedPass;
    this.salt = salt;
    this.roles = roles;
  }

  static async validate(model) {
    try {
      validateString({
        input: model.username,
        errorMessage: 'Невалидно потребителско име',
        checkLowerCase: true,
        minLen: constants.MIN_USERNAME_LEN,
        maxLen: constants.MAX_USERNAME_LEN,
      });

      validateStrArray({
        input: model.roles,
        errorMessage: 'Невалидни роли!',
        contentType: 'string',
        acceptableValues: Object.values(roleTypes),
      });

      validateString({ input: model.salt, errorMessage: 'Невалидни данни!' });
      validateString({ input: model.hashedPass, errorMessage: 'Невалидни данни!' });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = User;
