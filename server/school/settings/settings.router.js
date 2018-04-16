const roleTypes = require('../../utils/roletypes');

const init = ({ app, controllers, middlewares }) => {
  const controller = controllers.settings;
  const setupUrl = '/api/settings/setup';
  app.get(setupUrl, middlewares.user.isInRole(roleTypes.Teacher), controller.checkSetup);

  app.post(setupUrl, middlewares.user.isInRole(roleTypes.Teacher), controller.resetSetup);
};

module.exports = { init };
