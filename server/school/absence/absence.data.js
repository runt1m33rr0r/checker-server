const BaseData = require('../../base/base.data');

class AbsenceData extends BaseData {
  async createAbsence({
    day,
    hour,
    minute,
    subjectCode,
    groupName,
    studentUsername,
    teacherUsername,
  }) {
    const { Absence } = this.models;
    const entry = new Absence({
      day,
      hour,
      minute,
      subjectCode,
      groupName,
      studentUsername,
      teacherUsername,
    });
    return this.createEntry(entry);
  }

  async getAbsencesByStudent(username) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    return this.collection.find({ studentUsername: username }).toArray();
  }

  async getAbsencesByTeacher(username) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    return this.collection.find({ teacherUsername: username }).toArray();
  }
}

module.exports = AbsenceData;
