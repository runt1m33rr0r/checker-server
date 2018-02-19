function init({ data }) {
  const { StudentData, LessonData } = data;

  function verifyIdentity(req) {
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

    return StudentData.verifyIdentity(username, photo).then((studData) => {
      if (studData.same !== 'True') {
        return Promise.reject(new Error('Лицето на снимката не е ваше!'));
      }
    });
  }

  return {
    getStudentChecker(req, res) {
      res.render('school/students/checker');
    },
    getTimetablePage(req, res) {
      const { username } = req.user;
      StudentData.getStudentByUsername(username)
        .then(student => LessonData.getLessonsByGroupName(student.group))
        .then((lessons) => {
          res.render('school/students/timetable', {
            lessons,
          });
        });
    },
    getAbsencesPage(req, res) {
      const { username } = req.user;
      StudentData.getStudentByUsername(username).then((student) => {
        res.render('school/students/absences', {
          absences: student.absences,
        });
      });
    },
    createEncoding(req, res) {
      const photo = req.body.image;
      if (typeof photo !== 'string' || photo < 1) {
        return res.json({ success: false, message: 'Невалидно изображение!' });
      }
      const { username } = req;

      StudentData.createEncoding(photo)
        .then(encoding => StudentData.saveEncoding(username, encoding))
        .then(() => res.json({ success: true, message: 'Запазено успешно!' }))
        .catch(err => res.json({ success: false, message: err.message }));
    },
    check(req, res) {
      const { username } = req.user;

      return verifyIdentity(req)
        .then(() => StudentData.getStudentByUsername(username))
        .then((student) => {
          if (!student) {
            res.render('base/error', {
              error: {
                message: 'Вътрешна грешка!',
              },
            });
          }

          return Promise.resolve(student);
        })
        .then((student) => {
          const date = new Date();
          const currentDay = date.getDay();
          const currentHour = date.getHours();
          const currentMinute = date.getMinutes();
          const check = {
            day: currentDay,
            hour: currentHour,
            minute: currentMinute,
          };

          return StudentData.addCheck(student.username, check);
        })
        .then(() => {
          res.render('base/success', {
            success: {
              message: 'Успешно отбелязано присъствие!',
            },
          });
        })
        .catch(err =>
          res.render('base/error', {
            error: err,
          }));
    },
  };
}

module.exports = { init };
