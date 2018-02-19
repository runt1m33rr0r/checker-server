const roles = require('../../utils/roletypes');

function init({ app, controllers, middlewares }) {
  const controller = controllers.student;
  app.get(
    '/students/checker',
    middlewares.user.isInRole(roles.Student),
    controller.getStudentChecker,
  );
  app.get(
    '/students/timetable',
    middlewares.user.isInRole(roles.Student),
    controller.getTimetablePage,
  );
  app.get(
    '/students/absences',
    middlewares.user.isInRole(roles.Student),
    controller.getAbsencesPage,
  );
  app.post('/students/check', middlewares.user.isInRole(roles.Normal), controller.createEncoding);
}

module.exports = { init };
