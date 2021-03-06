const { validateString, validateStrArray } = require('../../utils/validators');
const constants = require('../../utils/constants');
const BaseModel = require('../../base/base.model');

class Student extends BaseModel {
  constructor(firstName, lastName, username, groups) {
    super();

    validateString({
      input: firstName,
      errorMessage: 'Невалидно име!',
      minLen: constants.MIN_NAME_LEN,
      maxLen: constants.MAX_NAME_LEN,
    });

    validateString({
      input: lastName,
      errorMessage: 'Невалидно фамилно име!',
      minLen: constants.MIN_NAME_LEN,
      maxLen: constants.MAX_NAME_LEN,
    });

    validateString({
      input: username,
      errorMessage: 'Невалидно потребителско име!',
      minLen: constants.MIN_USERNAME_LEN,
      maxLen: constants.MAX_USERNAME_LEN,
      checkLowerCase: true,
    });

    validateStrArray({
      input: groups,
      errorMessage: 'Невалидни групи',
      minLen: constants.MIN_GROUP_LEN,
      maxLen: constants.MAX_GROUP_LEN,
    });

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.groups = groups;
    this.encoding = '';
    this.checks = [];
  }
}

module.exports = Student;
