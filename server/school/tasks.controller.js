const schedule = require('node-schedule');

const init = ({ data: { StudentData, LessonData } }) => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 18;

  const wasAbsent = (checks, lesson) => {
    let absent = false;

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
        absent = false;
      } else {
        absent = true;
      }
    }

    return absent;
  };

  const performChecks = async (group, studentChecks, student) => {
    try {
      const lessons = await LessonData.getLessonsByGroupName(group);
      const absences = [];

      for (const lesson of lessons) {
        if (wasAbsent(studentChecks, lesson)) {
          const absence = StudentData.addAbsence(
            student.username,
            lesson.timeslot.day,
            lesson.timeslot.fromHour,
            lesson.timeslot.fromMinute,
            lesson.subjectCode,
          );
          absences.push(absence);
        }
      }

      await Promise.all(absences);
      await StudentData.clearChecks(student.username);
    } catch (error) {
      /* eslint no-console: 0 */
      console.log(error);
    }
  };

  const checkAbsences = async () => {
    try {
      const students = await StudentData.getAll();

      for (const student of students) {
        const { checks, group } = student;
        performChecks(group, checks, student);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const job = schedule.scheduleJob('*/1 * * * *', () => {
  //     checkAbscences();
  // });
  /* eslint no-unused-vars: 0 */
  const job = schedule.scheduleJob(rule, () => {
    checkAbsences();
  });
};

module.exports = { init };
