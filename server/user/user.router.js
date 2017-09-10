const roleTypes = require('../utils/roletypes');

function init({
    app,
    controllers,
    middlewares,
}) {
    app.get(
        '/users/search',
        middlewares.user.isInRole(roleTypes.Normal),
        controllers.user.searchUser);
    app.get('/users/register', controllers.user.getRegisterPage);
    app.get('/users/login', controllers.user.getLoginPage);
    app.get('/users/logout', middlewares.user.logoutUser);
    app.get('/unauthorized', controllers.user.getUnauthorized);

    app.post('/users/register', controllers.user.registerUser);
    app.post('/users/login', middlewares.user.loginLocal);
}

module.exports = {
    init,
};