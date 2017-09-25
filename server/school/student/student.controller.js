function init({
    data,
}) {
    const {
        StudentData,
    } = data;

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
        verifyIdentity(req, res) {
            if (!req.files ||
                !Array.isArray(req.files.photo) ||
                req.files.photo.length < 1 ||
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

            StudentData.verifyIdentity(username, photo)
                .then((data) => {
                    if (data.same === 'True') {
                        res.render('base/success', {
                            success: {
                                message: `Познахме те, ${username} ;)`,
                            },
                        });
                    } else {
                        res.render('base/error', {
                            error: {
                                message: `Не те познахме, ${username} :(`,
                            },
                        });
                    }
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