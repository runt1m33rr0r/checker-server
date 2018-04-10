class Lesson {
  constructor(lessonId, groupId, subjectId) {
    this._lessonId = lessonId;
    this._groupId = groupId;
    this._subjectId = subjectId;
    this._teacherId = 0;
    this._timeslotId = 0;
  }

  addTeacher(teacherId) {
    this._teacherId = teacherId;
  }

  addTimeslot(timeslotId) {
    this._timeslotId = timeslotId;
  }

  getLessonId() {
    return this._lessonId;
  }

  getGroupId() {
    return this._groupId;
  }

  getSubjectId() {
    return this._subjectId;
  }

  getTeacherId() {
    return this._teacherId;
  }

  getTimeslotId() {
    return this._timeslotId;
  }
}

module.exports = Lesson;
