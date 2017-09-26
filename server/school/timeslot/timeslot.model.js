class Timeslot {
    constructor(fromHour, fromMinute, toHour, toMinute, day) {
        if (typeof fromHour !== 'number' ||
            typeof fromMinute !== 'number' ||
            typeof toHour !== 'number' ||
            typeof toMinute !== 'number' ||
            typeof day !== 'number' ||
            fromHour < 0 || fromHour > 24 ||
            fromMinute < 0 || fromMinute > 60 ||
            toHour < 0 || toHour > 24 ||
            toMinute < 0 || toMinute > 60 ||
            day < 1 || day > 7) {
            throw new Error('Невалидни данни!');
        }

        this.fromHour = fromHour;
        this.fromMinute = fromMinute;
        this.toHour = toHour;
        this.toMinute = toMinute;
        this.day = day;
    }
}

module.exports = Timeslot;