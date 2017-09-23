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
        if (!Array.isArray(timeslotArray)) {
            return Promise.reject({
                message: 'Invalid timeslots!',
            });
        }

        let timeslotModels = [];
        let checks = [];

        for (let timeslot of timeslotArray) {
            const check = this.collection.findOne({
                    fromHour: timeslot.fromHour,
                    fromMinute: timeslot.fromMinute,
                    toHour: timeslot.toHour,
                    toMinute: timeslot.toMinute,
                    day: timeslot.day,
                })
                .then((result) => {
                    if (result) {
                        return Promise.reject({
                            message: 'Такива предмети вече съществуват!',
                        });
                    }

                    timeslotModels.push(new this.Timeslot(
                            timeslot.fromHour,
                            timeslot.fromMinute,
                            timeslot.toHour,
                            timeslot.toMinute,
                            timeslot.day));
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