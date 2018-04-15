const Generator = require('../../utils/timetable.generator');
const BaseController = require('../../base/base.controller');

class TimetableController extends BaseController {
  createLesson(req, res) {
    const {
      groupName, subjectCode, teacherUsername, timeslotID,
    } = req.body;

    const promises = [
      this.data.group.getGroupByName(groupName),
      this.data.subject.getSubjectByCode(subjectCode),
      this.data.teacher.getTeacherByUsername(teacherUsername),
      this.data.timeslot.getByID(timeslotID),
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
        this.data.lesson.createLesson(groupName, subjectCode, teacherUsername, timeslot))
      .then(() => res.json({ success: true, message: 'Урока беше успешно добавен!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  deleteLesson(req, res) {
    this.data.lesson.deleteLesson(req.body.lesson)
      .then(() => res.json({ success: true, message: 'Урока беше успешно премахнат!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  getAllGroupNames(req, res) {
    if (req.query.count === 'true') {
      this.data.group.getCount()
        .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      this.data.group.getAllPropVals('name')
        .then(groupNames =>
          res.json({ success: true, groupNames, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    }
  }

  getAllSubjectCodes(req, res) {
    if (req.query.count === 'true') {
      this.data.subject.getCount()
        .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else if (req.query.free === 'true') {
      this.data.subject.getFreeSubjects()
        .then(subjectCodes =>
          res.json({ success: true, subjectCodes, message: 'Свободни предмети получени!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      this.data.subject.getAllPropVals('code')
        .then(subjectCodes =>
          res.json({ success: true, subjectCodes, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    }
  }

  getAllTimeslots(req, res) {
    this.data.timeslot.getAll()
      .then(timeslots => res.json({ success: true, timeslots, message: 'Данни получени успешно!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  getAllTeacherUsernames(req, res) {
    if (req.query.count === 'true') {
      this.data.teacher.getCount()
        .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      this.data.teacher.getAllPropVals('username')
        .then(usernames =>
          res.json({ success: true, usernames, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    }
  }

  getAllStudents(req, res) {
    if (req.query.count === 'true') {
      this.data.student.getCount()
        .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      res.json({ success: true, message: 'Данни получени успешно!' });
    }
  }

  getNumberOfStudents(req, res) {
    this.data.student.getCount()
      .then(count => res.json({ success: true, count, message: 'Данни получени успешно!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  getGroupTimetable(req, res) {
    const { name } = req.params;
    this.data.lesson.getLessonsByGroupName(name)
      .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  getLessons(req, res) {
    if (req.query.mine === 'true' && req.roles.includes('Teacher')) {
      this.data.lesson.getLessonsByTeacher(req.username)
        .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else if (req.query.mine === 'true' && req.roles.includes('Student')) {
      this.data.student.getStudentByUsername(req.username)
        .then(student => this.data.LessonData.getLessonsByGroupName(student.group))
        .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else if (req.query.group) {
      this.data.lesson.getLessonsByGroupName(req.query.group)
        .then(lessons => res.json({ success: true, lessons, message: 'Данни получени успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      res.json({ success: true, lessons: [], message: 'Данни получени успешно!' });
    }
  }

  saveBaseSettings(req, res) {
    const { groups, timeslots, subjects } = req.body;

    this.data.group.clean()
      .then(() => this.data.teacher.clean())
      .then(() => this.data.student.clean())
      .then(() => this.data.user.cleanTeachers())
      .then(() => this.data.user.cleanStudents())
      .then(() => this.data.group.clean())
      .then(() => this.data.lesson.clean())
      .then(() => this.data.timeslot.clean())
      .then(() => this.data.subject.clean())
      .then(() => this.data.subject.createSubjects(subjects))
      .then(() => this.data.timeslot.createTimeslots(timeslots))
      .then(() => this.data.group.createGroups(groups))
      .then(() => this.data.settings.updateSettings({ setupFinished: true }))
      .then(() => res.json({ success: true, message: 'Настройките бяха успешно запазени!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  generateTimetable(req, res) {
    const timeslotsPromise = this.data.timeslot.getAll();
    const teachersPromise = this.data.teacher.getAll();
    const subjectsPromise = this.data.subject.getAll();
    const groupsPromise = this.data.group.getAll();

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
      .then(() => this.data.lesson.clean())
      .then(() => this.data.lesson.createLessons(lessons))
      .then(result =>
        res.json({ success: true, message: 'Успешно генерирана програма!', lessons: result }))
      .catch(err => res.json({ success: false, message: err.message }));
  }
}

module.exports = TimetableController;
