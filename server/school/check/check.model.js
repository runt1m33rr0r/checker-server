const { validateNumber } = require('../../utils/validators');
const constants = require('../../utils/constants');
const BaseModel = require('../../base/base.model');

class Check extends BaseModel {
  constructor(day, hour, minute) {
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

    this.day = day;
    this.hour = hour;
    this.minute = minute;
  }
}

module.exports = Check;
