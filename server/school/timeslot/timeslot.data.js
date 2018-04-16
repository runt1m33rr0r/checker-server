const BaseData = require('../../base/base.data');

class TimeslotData extends BaseData {
  async createTimeslots(timeslotArray) {
    if (!Array.isArray(timeslotArray)) {
      throw new Error('Невалидни времеви диапазони!');
    }

    const timeslotModels = [];
    const { Timeslot } = this.models;

    const checks = [];
    for (const timeslot of timeslotArray) {
      const {
        fromHour, fromMinute, toHour, toMinute, day,
      } = timeslot;
      checks.push(this.collection.findOne({
        fromHour,
        fromMinute,
        toHour,
        toMinute,
        day,
      }));
    }

    if ((await Promise.all(checks)).length > 0) {
      throw new Error('Вече има такъв диапазон!');
    }

    for (const t of timeslotArray) {
      const timeslot = new Timeslot(t.fromHour, t.fromMinute, t.toHour, t.toMinute, t.day);
      timeslotModels.push(timeslot);
    }

    return this.createManyEntries(timeslotModels);
  }
}

module.exports = TimeslotData;
