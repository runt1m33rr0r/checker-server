class Student {
  constructor(firstName, lastName, username, group) {
    if (typeof firstName !== 'string' || firstName.length < 3) {
      throw new Error('Невалидно име!');
    }

    if (typeof lastName !== 'string' || lastName.length < 3) {
      throw new Error('Невалидно фамилно име!');
    }

    if (typeof username !== 'string' || username.length < 6) {
      throw new Error('Невалидно потребителско име!');
    }

    if (typeof group !== 'string' || group.length < 2) {
      throw new Error('Невалидно група!');
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.group = group;
    this.encoding = '';
    this.marks = [];
    this.checks = [];
    this.absences = [];
  }

  static getSchema() {
    return {};
  }
}

module.exports = Student;
