const { validateString, validateStrArray } = require('../../utils/validators');
const constants = require('../../utils/constants');
const BaseModel = require('../../base/base.model');

class Subject extends BaseModel {
  constructor(name, code, teachers) {
    super();

    validateString({
      input: name,
      errorMessage: 'Невалидно име!',
      minLen: constants.MIN_NAME_LEN,
      maxLen: constants.MAX_NAME_LEN,
    });

    validateString({
      input: code,
      errorMessage: 'Невалиден код на предмет!',
      minLen: constants.MIN_SUBJECT_LEN,
      maxLen: constants.MAX_SUBJECT_LEN,
    });

    if (!Array.isArray(teachers)) {
      this.teachers = [];
    } else {
      validateStrArray({
        input: teachers,
        errorMessage: 'Невалидни учители!',
        minLen: constants.MIN_USERNAME_LEN,
        maxLen: constants.MAX_USERNAME_LEN,
        checkLowerCase: true,
      });
    }

    this.name = name;
    this.code = code;
  }
}

module.exports = Subject;
