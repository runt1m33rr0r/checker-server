const Generator = require('../../utils/timetable-generator');

function init({ data }) {
  const {
    GroupData, SubjectData, TimeslotData, TeacherData, LessonData, SettingsData,
  } = data;

  return {
    deleteTimetable(req, res) {
      LessonData.clean()
        .then(() => res.redirect('/school/settings/timetable/create'))
        .catch(err => res.render('base/error', { error: err }));
    },
    createLesson(req, res) {
      const groupName = req.body.group;
      const subjectCode = req.body.subject;
      const teacherUsername = req.body.teacher;
      const timeslotID = req.body.timeslot;

      const promises = [
        GroupData.getGroupByName(groupName),
        SubjectData.getSubjectByCode(subjectCode),
        TeacherData.getTeacherByUsername(teacherUsername),
        TimeslotData.getByID(timeslotID),
      ];
      Promise.all(promises)
        .then((result) => {
          const group = result[0];
          const subject = result[1];
          const teacher = result[2];
          const timeslot = result[3];

          if (!group || !subject || !teacher || !timeslot) {
            return Promise.reject(new Error('Невалидни данни!'));
          }

          return Promise.resolve(timeslot);
        })
        .then(timeslot =>
          LessonData.createLesson(groupName, subjectCode, teacherUsername, timeslot))
        .then(() => res.redirect('/school/settings/timetable/create'))
        .catch(err => res.render('base/error', { error: err }));
    },
    getAllGroups(req, res) {
      GroupData.getAll()
        .then(groupData => res.json({ groups: groupData }))
        .catch(err => res.json({ message: err.message }));
    },
    getAllSubjects(req, res) {
      SubjectData.getAll()
        .then((subjectData) => {
          res.json({
            subjects: subjectData,
          });
        })
        .catch((err) => {
          res.json({
            message: err.message,
          });
        });
    },
    saveBaseSettings(req, res) {
      const { groups, timeslots, subjects } = req.body;

      GroupData.clean()
        .then(() => TimeslotData.clean())
        .then(() => SubjectData.clean())
        .then(() => SubjectData.createSubjects(subjects))
        .then(() => TimeslotData.createTimeslots(timeslots))
        .then(() => GroupData.createGroups(groups))
        .then(() => res.json({ success: true, message: 'Настройките бяха успешно запазени!' }))
        .then(() => SettingsData.updateSettings({ setupFinished: true }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    generateTimetable(req, res) {
      const timeslotsPromise = TimeslotData.getAll();
      const teachersPromise = TeacherData.getAll();
      const subjectsPromise = SubjectData.getAll();
      const groupsPromise = GroupData.getAll();

      const lessons = [];

      Promise.all([timeslotsPromise, teachersPromise, subjectsPromise, groupsPromise])
        .then((result) => {
          const timeslots = result[0];
          const teachers = result[1];
          const subjects = result[2];
          const groups = result[3];

          if (
            timeslots.length < 1 ||
            teachers.length < 1 ||
            subjects.length < 1 ||
            groups.length < 1
          ) {
            return Promise.reject(new Error('Невалидни данни!'));
          }

          const generator = new Generator(timeslots, teachers, subjects, groups);
          return generator.getReadyTimetable().lessons;
        })
        .then((result) => {
          if (!Array.isArray(result)) {
            return Promise.reject(new Error('Невалидна програма!'));
          }

          const checks = [];
          for (let i = 0; i < lessons.length; i += 1) {
            const lesson = lessons[i];
            if (!lesson.timeslot) {
              return Promise.reject(new Error('Невалидно време!'));
            }

            const check = TimeslotData.getByID(lesson.timeslot._id).then(() => {
              if (!result) {
                return Promise.reject(new Error('Невалидно време!'));
              }
            });
            checks.push(check);
          }
          return Promise.all(checks);
        })
        .then(() => LessonData.clean())
        .then(() => LessonData.createLessons(lessons))
        .then(() => res.redirect('/school/settings/timetable/generate'))
        .catch(err => res.render('base/error', { error: err }));
    },
  };
}

module.exports = { init };
