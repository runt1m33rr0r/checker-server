class Timeslot {
    constructor(timeslotId, timeslot) {
        this._timeslotId = timeslotId;
        this._timeslot = timeslot;
    }

    getTimeslotId() {
        return this._timeslotId;
    }

    getTimeslot() {
        return this._timeslot;
    }
}

module.exports = Timeslot;