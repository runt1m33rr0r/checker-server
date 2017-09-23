function init({
    data,
}) {
    // const {
    // } = data;

    return {
        getStudentChecker(req, res) {
            res.render('school/students/checker');
        },
    };
}

module.exports = {
    init,
};