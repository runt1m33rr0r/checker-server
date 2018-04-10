const { validateNumber } = require('../../utils/validators');
const constants = require('../../utils/constants');

const errorMessage = 'Невалиден часови диапазон!';

class Timeslot {
  constructor(fromHour, fromMinute, toHour, toMinute, day) {
    validateNumber({
      input: fromHour,
      errorMessage,
      min: constants.MIN_HOUR,
      max: constants.MAX_HOUR,
    });

    validateNumber({
      input: fromMinute,
      errorMessage,
      min: constants.MIN_MINUTE,
      max: constants.MAX_MINUTE,
    });

    validateNumber({
      input: toHour,
      errorMessage,
      min: constants.MIN_HOUR,
      max: constants.MAX_HOUR,
    });

    validateNumber({
      input: toMinute,
      errorMessage,
      min: constants.MIN_MINUTE,
      max: constants.MAX_MINUTE,
    });

    validateNumber({
      input: day,
      errorMessage,
      min: constants.MIN_DAY,
      max: constants.MAX_DAY,
    });

    this.fromHour = fromHour;
    this.fromMinute = fromMinute;
    this.toHour = toHour;
    this.toMinute = toMinute;
    this.day = day;
  }
}

module.exports = Timeslot;
