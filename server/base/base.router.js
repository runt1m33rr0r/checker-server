function init({ app, controllers }) {
    app.get('/', controllers.base.redirectHome);
    app.get('/home', controllers.base.getHome);
}

module.exports = { init };