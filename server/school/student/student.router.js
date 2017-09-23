function init({
    app,
    controllers,
}) {
    const controller = controllers.student;
    app.get('/students/check', controller.getStudentChecker);
}

module.exports = {
    init,
};