const BaseController = require('../../base/base.controller');

class StudentController extends BaseController {
  verifyIdentity(req) {
    if (
      !req.files ||
      !Array.isArray(req.files.photo) ||
      req.files.photo.length < 1 ||
      !req.files.photo[0].buffer ||
      !req.user.username
    ) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    const photo = req.files.photo[0].buffer;
    const { username } = req.user;

    return this.data.student.verifyIdentity(username, photo).then((studData) => {
      if (studData.same !== 'True') {
        return Promise.reject(new Error('Лицето на снимката не е ваше!'));
      }
    });
  }

  getTimetable(req, res) {
    const { username } = req.user;
    this.data.student
      .getStudentByUsername(username)
      .then(student => this.data.lesson.getLessonsByGroupName(student.group))
      .then(result =>
        res.json({ success: true, message: 'Успешно получени данни.', lessons: result }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  getAbsences(req, res) {
    const { username } = req.user;
    this.data.student
      .getStudentByUsername(username)
      .then(student =>
        res.json({
          success: true,
          message: 'Успешно получени данни.',
          absences: student.absences,
        }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  createEncoding(req, res) {
    const photo = req.body.image;
    if (typeof photo !== 'string' || photo < 1) {
      return res.json({ success: false, message: 'Невалидно изображение!' });
    }
    const { username } = req;

    this.data.student
      .createEncoding(photo)
      .then(encoding => this.data.student.saveEncoding(username, encoding))
      .then(() => res.json({ success: true, message: 'Запазено успешно!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }

  check(req, res) {
    const { username } = req.user;

    return this.verifyIdentity(req)
      .then(() => this.data.StudentData.getStudentByUsername(username))
      .then((student) => {
        if (!student) {
          return Promise.reject(new Error('Вътрешна грешка!'));
        }

        return Promise.resolve(student);
      })
      .then((student) => {
        const date = new Date();
        return this.data.StudentData.addCheck(
          student.username,
          date.getDay(),
          date.getHours(),
          date.getMinutes(),
        );
      })
      .then(() => res.json({ success: true, message: 'Успешно отбелязано присъствие!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }
}

module.exports = StudentController;
