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
        .then(groupData => res.json({ success: true, groups: groupData }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    getAllSubjects(req, res) {
      SubjectData.getAll()
        .then(subjectData => res.json({ success: true, subjects: subjectData }))
        .catch(err => res.json({ success: false, message: err.message }));
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

      let lessons = [];

      Promise.all([timeslotsPromise, teachersPromise, subjectsPromise, groupsPromise])
        .then((result) => {
          const timeslots = result[0];
          const teachers = result[1];
          const subjects = result[2];
          const groups = result[3];

          for (let i = 0; i < subjects.length; i += 1) {
            const subject = subjects[i];
            if (subject.teachers.length < 1) {
              return Promise.reject(new Error('Не може да има предмети без преподаватели!'));
            }
          }

          if (
            timeslots.length < 1 ||
            teachers.length < 1 ||
            subjects.length < 1 ||
            groups.length < 1
          ) {
            return Promise.reject(new Error('Липсват данни(часови диапазони/учители/предмети/групи)!'));
          }

          const generator = new Generator(timeslots, teachers, subjects, groups);
          ({ lessons } = generator.getReadyTimetable());

          if (!Array.isArray(lessons) || lessons.length < 1) {
            return Promise.reject(new Error('Невалидна програма!'));
          }
        })
        .then(() => LessonData.clean())
        .then(() => LessonData.createLessons(lessons))
        .then(result =>
          res.json({ success: true, message: 'Успешно генерирана програма!', lessons: result }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
  };
}

module.exports = { init };
