const roleTypes = require('../utils/roletypes');

function init({ app, controllers, middlewares }) {
  const controller = controllers.settings;

  app.get(
    '/api/settings/setup',
    middlewares.user.isInRole(roleTypes.Teacher),
    controller.checkSetup,
  );
}

module.exports = { init };
