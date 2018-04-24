const schedule = require('node-schedule');

const init = ({ data: { StudentData, LessonData, AbsenceData } }) => {
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

      if (check.day === lesson.timeslot.day && diff >= 0 && diff <= 10) {
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
          const absence = AbsenceData.createAbsence({
            day: lesson.timeslot.day,
            hour: lesson.timeslot.fromHour,
            minute: lesson.timeslot.fromMinute,
            subjectCode: lesson.subjectCode,
            groupName: lesson.groupName,
            studentUsername: student.username,
            teacherUsername: lesson.teacherUsername,
          });
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
      const checksPerformed = [];

      for (const student of students) {
        const { checks, groups } = student;
        for (const group of groups) {
          checksPerformed.push(performChecks(group, checks, student));
        }
      }

      await Promise.all(checksPerformed);
    } catch (error) {
      console.log(error);
    }
  };

  // const job = schedule.scheduleJob('*/1 * * * *', async () => {
  //   console.log('check');
  //   await checkAbsences();
  // });
  /* eslint no-unused-vars: 0 */
  const job = schedule.scheduleJob(rule, async () => {
    await checkAbsences();
  });
};

module.exports = { init };
