const BaseData = require('../../base/base.data');

class TeacherData extends BaseData {
  createTeacher(firstName, lastName, username, isLead, group, subjects) {
    return this.getTeacherByUsername(username).then((result) => {
      if (result) {
        return Promise.reject(new Error('Вече има такъв преподавател!'));
      }

      const { Teacher } = this.models;
      const teacherModel = new Teacher(firstName, lastName, username, isLead, group, subjects);
      return this.createEntry(teacherModel);
    });
  }

  getTeacherByUsername(username) {
    if (!username) {
      return Promise.reject(new Error('Невалидно потребителско име!'));
    }

    return this.collection.findOne({ username });
  }
}

module.exports = TeacherData;
