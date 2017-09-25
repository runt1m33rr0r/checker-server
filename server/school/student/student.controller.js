function init({
    data,
}) {
    const {
        StudentData,
    } = data;

    function verifyIdentity(req, res) {
        if (!req.files ||
            !Array.isArray(req.files.photo) ||
            req.files.photo.length < 1 ||
            !req.files.photo[0].buffer ||
            !req.user.username) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        const photo = req.files.photo[0].buffer;
        const username = req.user.username;

        return StudentData.verifyIdentity(username, photo)
            .then((data) => {
                if (data.same !== 'True') {
                    return Promise.reject({
                        message: 'Невалидни данни!',
                    });
                }
            });
    }

    return {
        getStudentChecker(req, res) {
            res.render('school/students/checker');
        },
        createEncoding(req, res) {
            if (!req.files ||
                !Array.isArray(req.files.photo) ||
                req.files.photo.length < 1 ||
                !req.files.photo[0] ||
                !req.files.photo[0].buffer ||
                !req.user.username) {
                return res.render('base/error', {
                    error: {
                        message: 'Невалидни данни!',
                    },
                });
            }
            const photo = req.files.photo[0].buffer;
            const username = req.user.username;

            StudentData.createEncoding(photo)
                .then((encoding) => {
                    return StudentData.saveEncoding(username, encoding);
                })
                .then(() => {
                    res.redirect('/');
                })
                .catch((err) => res.render('base/error', {
                    error: err,
                }));
        },
        check(req, res) {
            const username = req.user.username;

            return verifyIdentity(req, res)
                .then(() => {
                    return StudentData.getStudentByUsername(username);
                })
                .then((student) => {
                    if (!student) {
                        res.render('base/error', {
                            error: {
                                message: 'Internal error!',
                            },
                        });
                    }

                    return Promise.resolve(student);
                })
                .then((student) => {
                    let date = new Date();
                    let currentDay = date.getDay();
                    let currentHour = date.getHours();
                    let currentMinute = date.getMinutes();
                    let check = {
                        day: currentDay,
                        hour: currentHour,
                        minute: currentMinute,
                    };

                    return StudentData.addCheck(student.username, check);
                })
                .then(() => {
                    res.render('base/success', {
                        success: {
                            message: 'Успешно отбелязано присъствие!',
                        },
                    });
                })
                .catch((err) => res.render('base/error', {
                    error: err,
                }));
        },
    };
}

module.exports = {
    init,
};