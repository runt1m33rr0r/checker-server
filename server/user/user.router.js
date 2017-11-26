const roleTypes = require('../utils/roletypes');
const multer = require('multer');

const upload = multer();

function init({ app, controllers, middlewares }) {
  app.get(
    '/users/search',
    middlewares.user.isInRole(roleTypes.Normal),
    controllers.user.searchUser,
  );
  app.get('/users/register', controllers.user.getRegisterPage);
  app.get('/users/login', controllers.user.getLoginPage);
  app.get('/users/logout', middlewares.user.logoutUser);
  app.get('/unauthorized', controllers.user.getUnauthorized);
  app.get('/users/profile', middlewares.user.isAuthenticated, controllers.user.getProfilePage);

  app.post('/users/register', controllers.user.registerUser);
  app.post('/users/login', controllers.user.loginUser);
  app.post(
    '/users/profile/save',
    middlewares.user.isAuthenticated,
    upload.fields([
      {
        name: 'photo',
        maxCount: 1,
      },
    ]),
    controllers.user.saveProfile,
  );
}

module.exports = { init };
