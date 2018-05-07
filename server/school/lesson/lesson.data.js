const BaseData = require('../../base/base.data');
const { validateString, validateObject, validateArray } = require('../../utils/validators');

class LessonData extends BaseData {
  _validateLessonData(groupName, subjectCode, teacherUsername, timeslot) {
    validateString({ input: groupName, errorMessage: 'Липва име на група!' });
    validateString({ input: subjectCode, errorMessage: 'Липсва код на предмет!' });
    validateString({ input: teacherUsername, errorMessage: 'Липва име преподавател!' });
    validateObject({ input: timeslot, errorMessage: 'Липсва час!' });
  }

  _getTimeslotQuery(timeslot) {
    return {
      'timeslot.fromHour': timeslot.fromHour,
      'timeslot.fromMinute': timeslot.fromMinute,
      'timeslot.toHour': timeslot.toHour,
      'timeslot.toMinute': timeslot.toMinute,
      'timeslot.day': timeslot.day,
    };
  }

  async _checkUniqueLesson(groupName, subjectCode, teacherUsername, timeslot) {
    this._validateLessonData(groupName, subjectCode, teacherUsername, timeslot);

    const lesson = await this.collection.findOne({
      groupName,
      subjectCode,
      teacherUsername,
      ...this._getTimeslotQuery(timeslot),
    });

    if (lesson) {
      throw new Error('Такъв час вече съществува!');
    }
  }

  async _checkFreeTimeslot(groupName, timeslot) {
    validateString({ input: groupName, errorMessage: 'Липва име на група!' });
    validateObject({ input: timeslot, errorMessage: 'Липсва час!' });

    const lesson = await this.collection.findOne({
      groupName,
      ...this._getTimeslotQuery(timeslot),
    });

    if (lesson) {
      throw new Error('Това време е заето!');
    }
  }

  async _checkLesson(lesson) {
    validateObject({ input: lesson, errorMessage: 'Липсва урок!' });
    const {
      groupName, subjectCode, teacherUsername, timeslot,
    } = lesson;

    await this._checkUniqueLesson(groupName, subjectCode, teacherUsername, timeslot);
    await this._checkFreeTimeslot(groupName, timeslot);
  }

  async createLessons(lessons) {
    validateArray({ input: lessons, errorMessage: 'Липсват уроци!' });

    const { Lesson } = this.models;
    const checks = [];
    const lessonModels = [];

    for (const lesson of lessons) {
      const model = new Lesson(
        lesson.groupName,
        lesson.subjectCode,
        lesson.teacherUsername,
        lesson.timeslot,
      );
      lessonModels.push(model);
      checks.push(this._checkLesson(lesson));
    }

    await Promise.all(checks);
    return this.createManyEntries(lessonModels);
  }

  async createLesson(groupName, subjectCode, teacherUsername, timeslot) {
    this._validateLessonData(groupName, subjectCode, teacherUsername, timeslot);

    await this._checkLesson({
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
    validateString({ input: groupName, errorMessage: 'Липва име на група!' });

    return this.collection.find({ groupName }).toArray();
  }

  async getLessonsByTeacher(username) {
    validateString({ input: username, errorMessage: 'Липсва потребителско име!' });

    return this.collection.find({ teacherUsername: username }).toArray();
  }

  async deleteLesson({
    groupName, subjectCode, teacherUsername, timeslot,
  }) {
    this._validateLessonData(groupName, subjectCode, teacherUsername, timeslot);

    return this.deleteOne({
      groupName,
      subjectCode,
      teacherUsername,
      ...this._getTimeslotQuery(timeslot),
    });
  }
}

module.exports = LessonData;
