const { validateNumber } = require('../../utils/validators');

const errorMessage = 'Невалиден часови диапазон!';

class Timeslot {
  constructor(fromHour, fromMinute, toHour, toMinute, day) {
    validateNumber({
      input: fromHour,
      errorMessage,
      min: 0,
      max: 24,
    });

    validateNumber({
      input: fromMinute,
      errorMessage,
      min: 0,
      max: 60,
    });

    validateNumber({
      input: toHour,
      errorMessage,
      min: 0,
      max: 24,
    });

    validateNumber({
      input: toMinute,
      errorMessage,
      min: 0,
      max: 60,
    });

    validateNumber({
      input: day,
      errorMessage,
      min: 1,
      max: 5,
    });

    this.fromHour = fromHour;
    this.fromMinute = fromMinute;
    this.toHour = toHour;
    this.toMinute = toMinute;
    this.day = day;
  }
}

module.exports = Timeslot;
