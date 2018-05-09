const init = ({ app, controllers, middlewares }) => {
  app.get('/api/profile', middlewares.user.isAuthenticated, controllers.user.getProfile);

  app.post('/users/register', controllers.user.registerUser);
  app.post('/users/login', controllers.user.loginUser);

  app.put('/users/password', middlewares.user.isAuthenticated, controllers.user.changePassword);
};

module.exports = { init };
