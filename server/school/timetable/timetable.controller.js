const Generator = require('../../utils/timetable-generator');

function init({ data }) {
  const {
    GroupData, SubjectData, TimeslotData, TeacherData, LessonData,
  } = data;

  return {
    deleteTimetable(req, res) {
      LessonData.clean()
        .then(() => {
          res.redirect('/school/settings/timetable/create');
        })
        .catch(err =>
          res.render('base/error', {
            error: err,
          }));
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
        .then(() => {
          res.redirect('/school/settings/timetable/create');
        })
        .catch(err =>
          res.render('base/error', {
            error: err,
          }));
    },
    getAllGroups(req, res) {
      GroupData.getAll()
        .then((groupData) => {
          res.status(200).json({
            groups: groupData,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    },
    getAllSubjects(req, res) {
      SubjectData.getAll()
        .then((subjectData) => {
          res.status(200).json({
            subjects: subjectData,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    },
    saveBaseSettings(req, res) {
      const { groups } = req.body;

      if (!groups) {
        return res.status(500).json({
          message: 'Невалидни данни!',
        });
      }

      GroupData.clean()
        .then(() => GroupData.createGroups(groups))
        .then(() => {
          res.status(200).json({
            message: 'Готово',
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: err.message,
          });
        });
    },
    saveSubjectSettings(req, res) {
      const { subjects } = req.body;

      if (!subjects) {
        return res.status(500).json({
          message: 'Невалидни данни!',
        });
      }

      SubjectData.clean()
        .then(() => SubjectData.createSubjects(subjects))
        .then(() => {
          res.status(200).json({
            message: 'Готово',
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: err.message,
          });
        });
    },
    saveTimetableSettings(req, res) {
      const { timeslots } = req.body;

      if (!timeslots) {
        return res.status(500).json({
          message: 'Невалидни данни!',
        });
      }

      TimeslotData.clean()
        .then(() => TimeslotData.createTimeslots(timeslots))
        .then(() => {
          res.status(200).json({
            message: 'Готово',
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: err.message,
          });
        });
    },
    saveGroupsSettings(req, res) {
      const { groups } = req.body;

      if (!groups || !Array.isArray(groups) || groups.length < 1) {
        return res.status(500).json({
          message: 'Невалидни данни!',
        });
      }

      const updates = [];
      /* eslint no-restricted-syntax: 0 */
      for (const group of groups) {
        if (!group.subjects || !Array.isArray(group.subjects)) {
          return res.status(400).json({
            message: 'Невалидни данни!',
          });
        }

        const update = SubjectData.getSubjectsByCodes(group.subjects).then(subjects =>
          GroupData.updateGroupSubjects(group.name, subjects));

        updates.push(update);
      }

      Promise.all(updates)
        .then(() => {
          res.status(200).json({
            message: 'Готово',
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: err.message,
          });
        });
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
          for (const lesson of lessons) {
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
