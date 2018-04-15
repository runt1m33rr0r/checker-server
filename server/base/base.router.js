function init({ app, controllers }) {
  app.get('/', controllers.base.getHome);
}

module.exports = { init };
