const schedule = require('node-schedule');
const BaseController = require('../base/base.controller');

class TasksController extends BaseController {
  constructor(...args) {
    super(...args);

    const rule = new schedule.RecurrenceRule();
    rule.hour = 18;

    // const job = schedule.scheduleJob('*/1 * * * *', () => {
    //     checkAbscences();
    // });

    /* eslint no-unused-vars: 0 */
    const job = schedule.scheduleJob(rule, () => {
      this.checkAbscences();
    });
  }

  wasAbscent(checks, lesson) {
    let abscent = false;
    /* eslint no-restricted-syntax: 0 */
    for (const check of checks) {
      const now = new Date();
      const checkDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        check.hour,
        check.minute,
      );
      const lessonDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        lesson.timeslot.fromHour,
        lesson.timeslot.fromMinute,
      );
      const diff = (checkDate - lessonDate) / 1000 / 60;

      if (check.day === lesson.timeslot.day && diff <= 10 && diff >= 0) {
        abscent = false;
      } else {
        abscent = true;
      }
    }

    return abscent;
  }

  performChecks(group, studentChecks, student) {
    this.data.lesson.getLessonsByGroupName(group).then((lessons) => {
      const absences = [];
      for (const lesson of lessons) {
        if (this.wasAbscent(studentChecks, lesson)) {
          absences.push(this.data.student.addAbsence(
            student.username,
            lesson.timeslot.day,
            lesson.timeslot.fromHour,
            lesson.timeslot.fromMinute,
            lesson.subjectCode,
          ));
        }
      }

      Promise.all(absences)
        .catch((err) => {
          console.log(err.message);
        })
        .then((e) => {
          this.data.student.clearChecks(student.username);
        });
    });
  }

  checkAbscences() {
    this.data.student.getAll().then((students) => {
      for (const student of students) {
        const { checks, group } = student;
        this.performChecks(group, checks, student);
      }
    });
  }
}

module.exports = TasksController;
