const multer = require('multer');
const upload = multer();

function init({
    app,
    controllers,
}) {
    const controller = controllers.student;
    app.get('/students/checker', controller.getStudentChecker);
    app.post(
        '/students/checker',
        upload.fields([{
            name: 'photo',
            maxCount: 1,
        }]),
        controller.verifyIdentity);
}

module.exports = {
    init,
};