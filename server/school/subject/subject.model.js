class Subject {
  constructor(name, code, teachers) {
    if (typeof name !== 'string' || name.length < 3 || name.length > 30) {
      throw new Error('Невалидни данни!');
    }

    if (typeof name !== 'string' || name.length < 3 || name.length > 30) {
      throw new Error('Невалидни данни!');
    }

    if (!teachers || !Array.isArray(teachers)) {
      throw new Error('Невалидни данни!');
    }

    /* eslint no-restricted-syntax: 0 */
    for (const teacher of teachers) {
      if (typeof teacher !== 'string' || teacher.length < 3) {
        throw new Error('Невалидни данни!');
      }
    }

    this.name = name;
    this.code = code;
    this.teachers = teachers;
  }
}

module.exports = Subject;
