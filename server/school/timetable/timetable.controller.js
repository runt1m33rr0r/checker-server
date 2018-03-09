const Generator = require('../../utils/timetable-generator');

function init({ data }) {
  const {
    GroupData,
    SubjectData,
    TimeslotData,
    TeacherData,
    LessonData,
    SettingsData,
    StudentData,
    UserData,
  } = data;

  return {
    createLesson(req, res) {
      const {
        groupName, subjectCode, teacherUsername, timeslotID,
      } = req.body;

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
            return Promise.reject(new Error('Невалидни данни за урок!'));
          }

          return Promise.resolve(timeslot);
        })
        .then(timeslot =>
          LessonData.createLesson(groupName, subjectCode, teacherUsername, timeslot))
        .then(() => res.json({ success: true, message: 'Урока беше успешно добавен!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    deleteLesson(req, res) {
      LessonData.deleteLesson(req.body.lesson)
        .then(() => res.json({ success: true, message: 'Урока беше успешно премахнат!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    getAllGroupNames(req, res) {
      if (req.query.count === 'true') {
        GroupData.getCount()
          .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else {
        GroupData.getAllPropVals('name')
          .then(groupNames =>
            res.json({ success: true, groupNames, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      }
    },
    getAllSubjectCodes(req, res) {
      if (req.query.count === 'true') {
        SubjectData.getCount()
          .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else if (req.query.free === 'true') {
        SubjectData.getFreeSubjects()
          .then(subjectCodes =>
            res.json({ success: true, subjectCodes, message: 'Свободни предмети получени!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else {
        SubjectData.getAllPropVals('code')
          .then(subjectCodes =>
            res.json({ success: true, subjectCodes, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      }
    },
    getAllTimeslots(req, res) {
      TimeslotData.getAll()
        .then(timeslots =>
          res.json({ success: true, timeslots, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    getAllTeacherUsernames(req, res) {
      if (req.query.count === 'true') {
        TeacherData.getCount()
          .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else {
        TeacherData.getAllPropVals('username')
          .then(usernames =>
            res.json({ success: true, usernames, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      }
    },
    getAllStudents(req, res) {
      if (req.query.count === 'true') {
        StudentData.getCount()
          .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else {
        res.json({ success: true, message: 'Данни получени успешно!' });
      }
    },
    getNumberOfStudents(req, res) {
      StudentData.getCount()
        .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    getGroupTimetable(req, res) {
      const { name } = req.params;
      LessonData.getLessonsByGroupName(name)
        .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    getLessons(req, res) {
      if (req.query.mine === 'true' && req.roles.includes('Teacher')) {
        LessonData.getLessonsByTeacher(req.username)
          .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else if (req.query.mine === 'true' && req.roles.includes('Student')) {
        StudentData.getStudentByUsername(req.username)
          .then(student => LessonData.getLessonsByGroupName(student.group))
          .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else if (req.query.group) {
        LessonData.getLessonsByGroupName(req.query.group)
          .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
          .catch(err => res.json({ success: false, message: err.message }));
      } else {
        res.json({ success: true, lessons: [], message: 'Данни получени успешно!' });
      }
    },
    saveBaseSettings(req, res) {
      const { groups, timeslots, subjects } = req.body;

      GroupData.clean()
        .then(() => TeacherData.clean())
        .then(() => StudentData.clean())
        .then(() => UserData.cleanTeachers())
        .then(() => UserData.cleanStudents())
        .then(() => GroupData.clean())
        .then(() => LessonData.clean())
        .then(() => TimeslotData.clean())
        .then(() => SubjectData.clean())
        .then(() => SubjectData.createSubjects(subjects))
        .then(() => TimeslotData.createTimeslots(timeslots))
        .then(() => GroupData.createGroups(groups))
        .then(() => SettingsData.updateSettings({ setupFinished: true }))
        .then(() => res.json({ success: true, message: 'Настройките бяха успешно запазени!' }))
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
