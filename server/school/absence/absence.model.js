const { validateString, validateNumber } = require('../../utils/validators');
const constants = require('../../utils/constants');
const BaseModel = require('../../base/base.model');

class Absence extends BaseModel {
  constructor({
    day, hour, minute, subjectCode, groupName, studentUsername, teacherUsername,
  }) {
    super();

    validateNumber({
      input: day,
      errorMessage: 'Невалиден ден!',
      min: constants.MIN_DAY,
      max: constants.MAX_DAY,
    });

    validateNumber({
      input: hour,
      errorMessage: 'Невалиден час!',
      min: constants.MIN_HOUR,
      max: constants.MAX_HOUR,
    });

    validateNumber({
      input: minute,
      errorMessage: 'Невалидна минута!',
      min: constants.MIN_MINUTE,
      max: constants.MAX_MINUTE,
    });

    validateString({
      input: subjectCode,
      errorMessage: 'Невалиден предмет!',
      minLen: constants.MIN_SUBJECT_LEN,
      maxLen: constants.MAX_SUBJECT_LEN,
    });

    validateString({
      input: groupName,
      errorMessage: 'Невалидно име на група!',
      minLen: constants.MIN_GROUP_LEN,
      maxLen: constants.MAX_GROUP_LEN,
    });

    validateString({
      input: studentUsername,
      errorMessage: 'Невалидно потребителско име!',
      minLen: constants.MIN_USERNAME_LEN,
      maxLen: constants.MAX_USERNAME_LEN,
    });

    validateString({
      input: teacherUsername,
      errorMessage: 'Невалидно потребителско име!',
      minLen: constants.MIN_USERNAME_LEN,
      maxLen: constants.MAX_USERNAME_LEN,
    });

    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.subjectCode = subjectCode;
    this.groupName = groupName;
    this.studentUsername = studentUsername;
    this.teacherUsername = teacherUsername;
  }
}

module.exports = Absence;
