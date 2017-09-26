const schedule = require('node-schedule');

function init({
    data,
}) {
    const {
        StudentData,
        LessonData,
    } = data;

    const rule = new schedule.RecurrenceRule();
    rule.hour = 18;

    function wasAbscent(checks, lesson) {
        let abscent = false;
        for (let check of checks) {
            const now = new Date();
            const checkDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                check.hour,
                check.minute);
            const lessonDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                lesson.timeslot.fromHour,
                lesson.timeslot.fromMinute);
            const diff = (checkDate - lessonDate) / 1000 / 60;

            if (check.day === lesson.timeslot.day &&
                diff <= 10 && diff >= 0) {
                abscent = false;
            } else {
                abscent = true;
            }
        }

        return abscent;
    }

    function performChecks(group, studentChecks, student) {
        LessonData.getLessonsByGroupName(group)
            .then((lessons) => {
                let absences = [];
                for (let lesson of lessons) {
                    if (wasAbscent(studentChecks, lesson)) {
                        const absence = {
                            day: lesson.timeslot.day,
                            hour: lesson.timeslot.fromHour,
                            minute: lesson.timeslot.fromMinute,
                            subject: lesson.subjectCode,
                        };
                        absences.push(
                            StudentData.addAbsence(
                                student.username,
                                absence));
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
        StudentData.getAll()
            .then((students) => {
                for (let student of students) {
                    const checks = student.checks;
                    const group = student.group;
                    performChecks(group, checks, student)
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

module.exports = {
    init,
};