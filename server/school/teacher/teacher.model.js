class Teacher {
  constructor(firstName, lastName, username, isLead, group, subjects) {
    if (typeof firstName !== 'string' || firstName.length < 3) {
      throw new Error('Невалидно име!');
    }

    if (typeof lastName !== 'string' || lastName.length < 3) {
      throw new Error('Невалидно фамилно име!');
    }

    if (typeof username !== 'string' || username.length < 6) {
      throw new Error('Невалидно потребителско име!');
    }

    if (typeof isLead !== 'boolean') {
      throw new Error('Невалидни учителски данни!');
    }

    if (typeof group !== 'string' || (isLead === true && group.length < 2)) {
      throw new Error('Невалидна група!');
    }

    if (!Array.isArray(subjects) || subjects.length < 1) {
      throw new Error('Невалидни предмети!');
    }

    /* eslint no-restricted-syntax: 0 */
    for (const subject of subjects) {
      if (typeof subject !== 'string' || subject.length < 3) {
        throw new Error('Невалидни предмети!');
      }
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.isLead = isLead;
    this.group = group;
    this.subjects = subjects;
  }
}

module.exports = Teacher;
