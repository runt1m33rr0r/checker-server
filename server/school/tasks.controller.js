const schedule = require('node-schedule');

function init({ data }) {
  const { StudentData, LessonData } = data;

  const rule = new schedule.RecurrenceRule();
  rule.hour = 18;

  function wasAbscent(checks, lesson) {
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

  function performChecks(group, studentChecks, student) {
    LessonData.getLessonsByGroupName(group).then((lessons) => {
      const absences = [];
      for (const lesson of lessons) {
        if (wasAbscent(studentChecks, lesson)) {
          absences.push(StudentData.addAbsence(
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
          StudentData.clearChecks(student.username);
        });
    });
  }

  function checkAbscences() {
    StudentData.getAll().then((students) => {
      for (const student of students) {
        const { checks, group } = student;
        performChecks(group, checks, student);
      }
    });
  }

  // const job = schedule.scheduleJob('*/1 * * * *', () => {
  //     checkAbscences();
  // });
  const job = schedule.scheduleJob(rule, () => {
    checkAbscences();
  });
}

module.exports = { init };
