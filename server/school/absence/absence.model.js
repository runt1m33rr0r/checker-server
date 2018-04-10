const { validateString, validateNumber } = require('../../utils/validators');
const constants = require('../../utils/constants');

class Absence {
  constructor(day, hour, minute, subject) {
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
      input: subject,
      errorMessage: 'Невалиден предмет!',
      minLen: constants.MIN_SUBJECT_LEN,
      maxLen: constants.MAX_SUBJECT_LEN,
    });

    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.subject = subject;
  }
}

module.exports = Absence;
