const roles = require('../../utils/roletypes');

const init = ({ app, controllers, middlewares }) => {
  const controller = controllers.student;

  app.post('/students/encode', middlewares.user.isInRole(roles.Student), controller.createEncoding);
  app.post('/students/check', middlewares.user.isInRole(roles.Student), controller.check);
};

module.exports = { init };
