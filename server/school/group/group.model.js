class Group {
  constructor(name, subjects) {
    if (typeof name !== 'string' || name.length < 1 || name.length > 5) {
      throw new Error('Невалидно име на група!');
    }

    if (!subjects || !Array.isArray(subjects)) {
      throw new Error('Не може да има група без предмети!');
    }

    /* eslint no-restricted-syntax: 0 */
    for (const subject of subjects) {
      if (typeof subject !== 'string' || subject.length < 3) {
        throw new Error('Невалидно име на предмет!');
      }
    }

    this.name = name;
    this.subjects = subjects;
    this.students = [];
    this.leadTeacher = '';
  }
}

module.exports = Group;
