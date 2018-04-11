const { validateString, validateObject, validateNumber } = require('../../utils/validators');
const constants = require('../../utils/constants');
const BaseModel = require('../../base/base.model');

const invalidTime = 'Невалидно време!';

class Lesson extends BaseModel {
  constructor(groupName, subjectCode, teacherUsername, timeslot) {
    super();

    validateString({
      input: groupName,
      errorMessage: 'Невалидно име!',
      minLen: constants.MIN_GROUP_LEN,
      maxLen: constants.MAX_GROUP_LEN,
    });

    validateString({
      input: subjectCode,
      errorMessage: 'Невалиден предмет!',
      minLen: constants.MIN_SUBJECT_LEN,
      maxLen: constants.MAX_SUBJECT_LEN,
    });

    validateString({
      input: teacherUsername,
      errorMessage: 'Невалиден преподавател!',
      minLen: constants.MIN_USERNAME_LEN,
      maxLen: constants.MAX_USERNAME_LEN,
      checkLowerCase: true,
    });

    validateObject({ input: timeslot, errorMessage: invalidTime });
    validateNumber({
      input: timeslot.fromHour,
      errorMessage: invalidTime,
      min: constants.MIN_HOUR,
      max: constants.MAX_HOUR,
    });
    validateNumber({
      input: timeslot.fromMinute,
      errorMessage: invalidTime,
      min: constants.MIN_MINUTE,
      max: constants.MAX_MINUTE,
    });
    validateNumber({
      input: timeslot.toHour,
      errorMessage: invalidTime,
      min: constants.MIN_HOUR,
      max: constants.MAX_HOUR,
    });
    validateNumber({
      input: timeslot.toMinute,
      errorMessage: invalidTime,
      min: constants.MIN_MINUTE,
      max: constants.MAX_MINUTE,
    });
    validateNumber({
      input: timeslot.day,
      errorMessage: invalidTime,
      min: constants.MIN_DAY,
      max: constants.MAX_DAY,
    });

    this.groupName = groupName;
    this.subjectCode = subjectCode;
    this.teacherUsername = teacherUsername;
    this.timeslot = timeslot;
  }
}

module.exports = Lesson;
