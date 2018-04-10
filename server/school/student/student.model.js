const { validateString } = require('../../utils/validators');
const constants = require('../../utils/constants');

class Student {
  constructor(firstName, lastName, username, group) {
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

    validateString({
      input: group,
      errorMessage: 'Невалидна група!',
      minLen: constants.MIN_GROUP_LEN,
      maxLen: constants.MAX_GROUP_LEN,
    });

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.group = group;
    this.encoding = '';
    this.marks = [];
    this.checks = [];
    this.absences = [];
  }
}

module.exports = Student;
