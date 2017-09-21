const BaseData = require('../../base/base.data');

class TimeslotData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Timeslot,
        } = models;
        this.Timeslot = Timeslot;
    }

    createTimeslots(timeslotArray) {
        let timeslotModels = [];
        let checks = [];

        for (let timeslot of timeslotArray) {
            const fromHour = timeslot.fromHour;
            const fromMinute = timeslot.fromMinute;
            const toHour = timeslot.toHour;
            const toMinute = timeslot.toMinute;
            const day = timeslot.day;

            const check = this.collection.findOne({
                    fromHour: fromHour,
                    fromMinute: fromMinute,
                    toHour: toHour,
                    toMinute: toMinute,
                    day: day,
                })
                .then((result) => {
                    if (result) {
                        return Promise.reject({
                            message: 'Такива предмети вече съществуват!',
                        });
                    }

                    timeslotModels.push(
                        new this.Timeslot(
                            fromHour, fromMinute, toHour, toMinute, day));
                });
            checks.push(check);
        }

        return Promise.all(checks)
            .then(() => {
                return this.createManyEntries(timeslotModels);
            });
    }
}

module.exports = TimeslotData;