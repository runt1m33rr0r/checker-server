const roleTypes = require('../utils/roletypes');

function init({
    data,
    encryption,
}) {
    const {
        UserData,
        TeacherData,
        GroupData,
        SubjectData,
        StudentData,
    } = data;

    function registerTeacher(
        firstName,
        lastName,
        username,
        isLead,
        group,
        subjects) {
        if (isLead) {
            return GroupData.getGroupByName(group)
                .then((result) => {
                    if (result) {
                        return SubjectData.getSubjectsByCodes(subjects);
                    } else {
                        return Promise.reject({
                            message: 'Невалидна група!',
                        });
                    }
                })
                .then((subjectCodes) => {
                    return TeacherData.createTeacher(
                        firstName,
                        lastName,
                        username,
                        true,
                        group,
                        subjectCodes,
                    );
                })
                .then((result) => {
                    return SubjectData.addTeacherToSubjects(
                        username, result.subjects);
                });
        } else {
            return SubjectData.getSubjectsByCodes(subjects)
                .then((subjectCodes) => {
                    return TeacherData.createTeacher(
                        firstName,
                        lastName,
                        username,
                        false,
                        '',
                        subjectCodes,
                    );
                })
                .then((result) => {
                    return SubjectData.addTeacherToSubjects(
                        username, result.subjects);
                });
        }
    }

    function registerStudent(firstName, lastName, username, group) {
        return GroupData.getGroupByName(group)
            .then((result) => {
                if (result) {
                    return StudentData.createStudent(
                        firstName, lastName, username, group);
                } else {
                    return Promise.reject({
                        message: 'Невалидна група!',
                    });
                }
            });
    }

    function getUserByUsername(req, res) {
        const username = req.query.username;

        UserData.getUserByUsername(username)
            .then((user) => {
                if (!user) {
                    return res.render('base/error', {
                        error: {
                            message: 'Такъв потребител не съществува!',
                        },
                    });
                }

                return res.send(user);
            })
            .catch((err) => res.render('base/error', {
                error: err,
            }));
    }

    function getUserById(req, res) {
        const id = req.query.id;

        UserData.getUserById(id)
            .then((user) => {
                if (!user) {
                    return res.render('base/error', {
                        error: {
                            message: 'Такъв потребител не съществува!',
                        },
                    });
                }

                return res.send(user);
            })
            .catch((err) => res.render('base/error', {
                error: err,
            }));
    }

    return {
        searchUser(req, res) {
            const username = req.query.username;
            const id = req.query.id;

            if (username) {
                return getUserByUsername(req, res);
            } else if (id) {
                return getUserById(req, res);
            }

            return res.render('base/error', {
                error: {
                    message: 'Невалидна заявка!',
                },
            });
        },
        getLoginPage(req, res) {
            res.render('user/login');
        },
        getRegisterPage(req, res) {
            res.render('user/register');
        },
        getProfilePage(req, res) {
            if (req.user.roles.includes('Student')) {
                StudentData.getStudentByUsername(req.user.username)
                    .then((user) => {
                        res.render('user/profile', {
                            student: user,
                        });
                    })
                    .catch((err) => res.render('base/error', {
                        error: err,
                    }));
            } else if (req.user.roles.includes('Teacher')) {
                TeacherData.getTeacherByUsername(req.user.username)
                    .then((user) => {
                        res.render('user/profile', {
                            teacher: user,
                        });
                    })
                    .catch((err) => res.render('base/error', {
                        error: err,
                    }));
            } else {
                res.render('base/error', {
                    error: {
                        message: 'Internal error!',
                    },
                });
            }
        },
        saveProfile(req, res) {
            const roles = req.user.roles;
            if (roles.includes('Student')) {
                if (!req.files ||
                    !Array.isArray(req.files.photo) ||
                    req.files.photo.length < 1 ||
                    !req.files.photo[0] ||
                    !req.files.photo[0].buffer) {
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
                        res.render('base/success', {
                            success: {
                                message: 'Настройките се запазиха успешно!',
                            },
                        });
                    })
                    .catch((err) => res.render('base/error', {
                        error: err,
                    }));
            } else {
                // add other stuff later
                res.redirect('/');
            }
        },
        registerUser(req, res) {
            if (req.user) {
                res.redirect('/unauthorized');
            }

            const username = req.body.username;
            const password = req.body.password;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const salt = encryption.getSalt();
            const hash = encryption.getHash(salt, password);
            const leadTeacher = req.body.leadTeacher;
            const group = req.body.group;
            const subjects = req.body.subjects;
            const userType = req.body.userType;
            const roles = [roleTypes.Normal];

            if (userType === roleTypes.Student) {
                roles.push(roleTypes.Student);
                registerStudent(firstName, lastName, username, group)
                    .then(() => {
                        return UserData.createUser(username, roles, salt, hash);
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'cool',
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            message: err.message,
                        });
                    });
            } else if (userType === roleTypes.Teacher) {
                if (typeof leadTeacher !== 'boolean') {
                    return res.status(500).json({
                        message: 'Невалиден потребител!',
                    });
                }

                roles.push(roleTypes.Teacher);

                registerTeacher(
                        firstName,
                        lastName,
                        username,
                        leadTeacher,
                        group,
                        subjects)
                    .then(() => {
                        return UserData.createUser(username, roles, salt, hash);
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'cool',
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            message: err.message,
                        });
                    });
            } else {
                res.status(500).json({
                    message: 'Невалиден потребител!',
                });
            }
        },
        getUnauthorized(req, res) {
            res.render('base/unauthorized');
        },
    };
}

module.exports = {
    init,
};