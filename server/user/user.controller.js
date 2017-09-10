const roleTypes = require('../utils/roletypes');

function init({
    data,
    encryption,
}) {
    const {
        UserData,
    } = data;

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
        registerUser(req, res) {
            if (req.user) {
                res.redirect('/unauthorized');
            }

            const username = req.body.username;
            const password = req.body.password;
            const salt = encryption.getSalt();
            const hash = encryption.getHash(salt, password);
            const roles = [roleTypes.Normal];

            UserData.createUser(username, roles, salt, hash)
                .then(() => {
                    res.redirect('/users/login');
                })
                .catch((err) => res.render('base/error', {
                    error: err,
                }));
        },
        getUnauthorized(req, res) {
            res.render('base/unauthorized');
        },
    };
}

module.exports = {
    init,
};