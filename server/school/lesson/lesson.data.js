const BaseData = require('../../base/base.data');

class LessonData extends BaseData {
  constructor(db, models) {
    super(db);

    const { Lesson } = models;
    this.Lesson = Lesson;
  }

  checkUnique(groupName, subjectCode, teacherUsername, timeslot) {
    return this.collection
      .findOne({
        groupName,
        subjectCode,
        teacherUsername,
        timeslot,
      })
      .then((result) => {
        if (result) {
          return Promise.reject(new Error('Такъв час вече съществува!'));
        }
      });
  }

  checkFreeTimeslot(groupName, timeslot) {
    return this.collection.findOne({ groupName, timeslot }).then((result) => {
      if (result) {
        return Promise.reject(new Error('Това време е заето!'));
      }
    });
  }

  createLessons(lessons) {
    if (!Array.isArray(lessons)) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    const checks = [];
    const lessonModels = [];
    /* eslint no-restricted-syntax: 0 */
    for (const lesson of lessons) {
      const check = this.checkUnique(lesson.group, lesson.subject, lesson.teacher, lesson.timeslot)
        .then(() => this.checkFreeTimeslot(lesson.group, lesson.timeslot))
        .then(() => {
          /* eslint max-len: 0 */
          lessonModels.push(new this.Lesson(lesson.group, lesson.subject, lesson.teacher, lesson.timeslot));
        });
      checks.push(check);
    }

    return Promise.all(checks).then(() => this.createManyEntries(lessonModels));
  }

  createLesson(groupName, subjectCode, teacherUsername, timeslot) {
    return this.checkUnique(groupName, subjectCode, teacherUsername, timeslot)
      .then(() => this.checkFreeTimeslot(groupName, timeslot))
      .then(() => {
        const model = new this.Lesson(groupName, subjectCode, teacherUsername, timeslot);

        return this.createEntry(model);
      });
  }

  getLessonsByGroupName(groupName) {
    return this.collection
      .find({
        groupName,
      })
      .toArray();
  }

  getLessonsByTeacher(username) {
    return this.collection
      .find({
        teacherUsername: username,
      })
      .toArray();
  }

  deleteLesson({
    groupName, subjectCode, teacherUsername, timeslot,
  }) {
    const {
      fromHour, fromMinute, toHour, toMinute, day,
    } = timeslot;
    return this.deleteOne({
      groupName,
      subjectCode,
      teacherUsername,
      'timeslot.fromHour': fromHour,
      'timeslot.fromMinute': fromMinute,
      'timeslot.toHour': toHour,
      'timeslot.toMinute': toMinute,
      'timeslot.day': day,
    });
  }
}

module.exports = LessonData;
