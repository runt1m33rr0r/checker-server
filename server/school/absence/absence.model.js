class Absence {
  constructor(day, hour, minute, subject) {
    if (typeof day !== 'number' || day < 1 || day > 5) {
      throw new Error('Невалиден ден!');
    }

    if (typeof hour !== 'number' || hour < 1 || hour > 23) {
      throw new Error('Невалиден час!');
    }

    if (typeof minute !== 'number' || minute < 1 || minute > 60) {
      throw new Error('Невалидна минута!');
    }

    if (typeof subject !== 'string' || subject.length < 6 || subject.length > 30) {
      throw new Error('Невалиден предмет!');
    }

    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.subject = subject;
  }
}

module.exports = Absence;
