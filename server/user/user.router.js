const roleTypes = require('../utils/roletypes');

function init({ app, controllers, middlewares }) {
    app.get(
        '/users/search',
        middlewares.user.isInRole(roleTypes.Normal),
        controllers.user.searchUser);
    app.get('/register', controllers.user.getRegisterPage);
    app.get('/login', controllers.user.getLoginPage);

    app.post('/register', controllers.user.registerUser);
    app.post('/login', middlewares.user.loginLocal);
    app.post('/logout', middlewares.user.logoutUser);
}

module.exports = { init };