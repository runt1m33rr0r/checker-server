function init({ app, controllers }) {
  const controller = controllers.base;

  app.get('/', controller.getHome);
}

module.exports = { init };
