function init({
    data,
}) {
    const {
        StudentData,
        LessonData,
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
                        message: 'Лицето на снимката не е ваше!',
                    });
                }
            });
    }

    return {
        getStudentChecker(req, res) {
            res.render('school/students/checker');
        },
        getTimetablePage(req, res) {
            const username = req.user.username;
            StudentData.getStudentByUsername(username)
                .then((student) => {
                    return LessonData.getLessonsByGroupName(student.group);
                })
                .then((lessons) => {
                    res.render('school/students/timetable', {
                        lessons: lessons,
                    });
                });
        },
        getAbsencesPage(req, res) {
            const username = req.user.username;
            StudentData.getStudentByUsername(username)
                .then((student) => {
                    res.render('school/students/absences', {
                        absences: student.absences,
                    });
                });
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
                .then((res) => {
                    return StudentData.getStudentByUsername(username);
                })
                .then((student) => {
                    if (!student) {
                        res.render('base/error', {
                            error: {
                                message: 'Вътрешна грешка!',
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