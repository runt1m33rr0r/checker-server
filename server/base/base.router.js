function init({
    app,
    controllers,
}) {
    app.get('/', controllers.base.redirectHome);
    app.get('/home', controllers.base.getHome);
    app.get('/help', controllers.base.getHelp);
}

module.exports = {
    init,
};