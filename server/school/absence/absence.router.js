const roles = require('../../utils/roletypes');

const init = ({ app, controllers, middlewares }) => {
  const controller = controllers.absence;

  app.get(
    '/absences/student',
    middlewares.user.isInRole(roles.Student),
    controller.getAbsencesForStudent,
  );
  app.get(
    '/absences/teacher',
    middlewares.user.isInRole(roles.Teacher),
    controller.getAbsencesForTeacher,
  );
};

module.exports = { init };
