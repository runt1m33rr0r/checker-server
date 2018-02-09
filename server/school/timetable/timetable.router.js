const roleTypes = require('../../utils/roletypes');

function init({ app, controllers, middlewares }) {
  const settingsRoute = '/api/school/settings/';
  const controller = controllers.timetable;

  app.get('/api/groups', controller.getAllGroups);
  app.get('/api/subjects', controller.getAllSubjects);

  app.post(
    `${settingsRoute}base`,
    middlewares.user.isInRole(roleTypes.Teacher),
    controller.saveBaseSettings,
  );
  app.post(
    `${settingsRoute}timetable/generate`,
    middlewares.user.isInRole(roleTypes.Teacher),
    controller.generateTimetable,
  );
  app.post(
    `${settingsRoute}timetable/delete`,
    middlewares.user.isInRole(roleTypes.Teacher),
    controller.deleteTimetable,
  );
  app.post(
    `${settingsRoute}timetable/add`,
    middlewares.user.isInRole(roleTypes.Teacher),
    controller.createLesson,
  );
}

module.exports = { init };
