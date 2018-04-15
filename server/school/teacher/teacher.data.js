const BaseData = require('../../base/base.data');

class TeacherData extends BaseData {
  async createTeacher(firstName, lastName, username, isLead, group, subjects) {
    if (await this.getTeacherByUsername(username)) {
      throw new Error('Вече има такъв преподавател!');
    }

    const { Teacher } = this.models;
    return this.createEntry(new Teacher(firstName, lastName, username, isLead, group, subjects));
  }

  async getTeacherByUsername(username) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    return this.collection.findOne({ username });
  }
}

module.exports = TeacherData;
