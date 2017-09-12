function init({
    app,
    controllers,
}) {
    app.get('/room', controllers.timetable.getSetupPage);
    app.post('/room', controllers.timetable.createRooms);
}

module.exports = {
    init,
};