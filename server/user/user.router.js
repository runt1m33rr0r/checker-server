function init({ app, controllers, middlewares }) {
  app.get('/users/profile', middlewares.user.isAuthenticated, controllers.user.getProfile);

  app.post('/users/register', controllers.user.registerUser);
  app.post('/users/login', controllers.user.loginUser);
  app.post('/users/profile/save', middlewares.user.isAuthenticated, controllers.user.saveProfile);
}

module.exports = { init };
