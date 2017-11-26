class Teacher {
  constructor(teacherId, teacherName) {
    this._teacherId = teacherId;
    this._teacherName = teacherName;
  }

  getTeacherId() {
    return this._teacherId;
  }

  getTeacherName() {
    return this._teacherName;
  }
}

module.exports = Teacher;
