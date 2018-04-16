const BaseData = require('../../base/base.data');

class LessonData extends BaseData {
  async checkUniqueLesson(groupName, subjectCode, teacherUsername, timeslot) {
    const lesson = await this.collection.findOne({
      groupName,
      subjectCode,
      teacherUsername,
      timeslot,
    });
    if (lesson) {
      throw new Error('Такъв час вече съществува!');
    }
  }

  async checkFreeTimeslot(groupName, timeslot) {
    if (await this.collection.findOne({ groupName, timeslot })) {
      throw new Error('Това време е заето!');
    }
  }

  async checkLesson(lesson) {
    return Promise.all([
      this.checkUniqueLesson(lesson.group, lesson.subject, lesson.teacher, lesson.timeslot),
      this.checkFreeTimeslot(lesson.group, lesson.timeslot),
    ]);
  }

  async createLessons(lessons) {
    if (!Array.isArray(lessons)) {
      throw new Error('Невалидни уроци!');
    }

    const { Lesson } = this.models;
    const checks = [];
    const lessonModels = [];

    for (const lesson of lessons) {
      lessonModels.push(new Lesson(lesson.group, lesson.subject, lesson.teacher, lesson.timeslot));
      checks.push(this.checkLesson(lesson));
    }

    await Promise.all(checks);
    return this.createManyEntries(lessonModels);
  }

  async createLesson(groupName, subjectCode, teacherUsername, timeslot) {
    await this.checkLesson({
      groupName,
      subjectCode,
      teacherUsername,
      timeslot,
    });

    const { Lesson } = this.models;
    const model = new Lesson(groupName, subjectCode, teacherUsername, timeslot);
    return this.createEntry(model);
  }

  async getLessonsByGroupName(groupName) {
    return this.collection.find({ groupName }).toArray();
  }

  async getLessonsByTeacher(username) {
    return this.collection.find({ teacherUsername: username }).toArray();
  }

  async deleteLesson({
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
