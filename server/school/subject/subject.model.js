class Subject {
  constructor(name, code, teachers) {
    if (typeof name !== 'string' || name.length < 3 || name.length > 30) {
      throw new Error('Невалидно име на предмет!');
    }

    if (typeof code !== 'string' || code.length < 3 || code.length > 30) {
      throw new Error('Невалиден код на предмет!');
    }

    if (!Array.isArray(teachers)) {
      this.teachers = [];
    }

    /* eslint no-restricted-syntax: 0 */
    for (const teacher of this.teachers) {
      if (typeof teacher !== 'string' || teacher.length < 3) {
        throw new Error('Невалиден учител!');
      }
    }

    this.name = name;
    this.code = code;
  }
}

module.exports = Subject;
