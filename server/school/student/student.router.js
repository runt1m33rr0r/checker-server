const roles = require('../../utils/roletypes');

function init({ app, controllers, middlewares }) {
  const controller = controllers.student;

  app.post('/students/check', middlewares.user.isInRole(roles.Normal), controller.createEncoding);
}

module.exports = { init };
