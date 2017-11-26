const BaseData = require('../../base/base.data');

class TimeslotData extends BaseData {
  constructor(db, models) {
    super(db);

    const { Timeslot } = models;
    this.Timeslot = Timeslot;
  }

  createTimeslots(timeslotArray) {
    if (!Array.isArray(timeslotArray)) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    const timeslotModels = [];
    const checks = [];

    /* eslint no-restricted-syntax: 0 */
    for (const timeslot of timeslotArray) {
      const check = this.collection
        .findOne({
          fromHour: timeslot.fromHour,
          fromMinute: timeslot.fromMinute,
          toHour: timeslot.toHour,
          toMinute: timeslot.toMinute,
          day: timeslot.day,
        })
        .then((result) => {
          if (result) {
            return Promise.reject(new Error('Такива предмети вече съществуват!'));
          }

          timeslotModels.push(new this.Timeslot(
            timeslot.fromHour,
            timeslot.fromMinute,
            timeslot.toHour,
            timeslot.toMinute,
            timeslot.day,
          ));
        });
      checks.push(check);
    }

    return Promise.all(checks).then(() => this.createManyEntries(timeslotModels));
  }
}

module.exports = TimeslotData;
