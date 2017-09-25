const multer = require('multer');
const roles = require('../../utils/roletypes');
const upload = multer();

function init({
    app,
    controllers,
    middlewares,
}) {
    const controller = controllers.student;
    app.get(
        '/students/checker',
        middlewares.user.isInRole(roles.Student),
        controller.getStudentChecker);
    app.post(
        '/students/checker',
        middlewares.user.isInRole(roles.Student),
        upload.fields([{
            name: 'photo',
            maxCount: 1,
        }]),
        controller.check);
}

module.exports = {
    init,
};