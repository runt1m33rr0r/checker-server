const { validateString, validateBool, validateStrArray } = require('../../utils/validators');
const constants = require('../../utils/constants');

class Teacher {
  constructor(firstName, lastName, username, isLead, group, subjects) {
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
    });

    validateBool({ input: isLead, errorMessage: 'Невалидни учителски данни!' });

    if (isLead === true) {
      validateString({
        input: group,
        errorMessage: 'Невалидна група!',
        minLen: constants.MIN_GROUP_LEN,
        maxLen: constants.MAX_GROUP_LEN,
      });
    }

    validateStrArray({
      input: subjects,
      errorMessage: 'Невалидни предмети!',
      minLen: constants.MIN_SUBJECT_LEN,
      maxLen: constants.MAX_SUBJECT_LEN,
    });

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.isLead = isLead;
    this.group = group;
    this.subjects = subjects;
  }
}

module.exports = Teacher;
