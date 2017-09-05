const roleTypes = require('../utils/roletypes');

function init({ data, encryption }) {
    const { UserData } = data;

    function getUserByUsername(req, res) {
        const username = req.query.username;

        UserData.getUserByUsername(username)
            .then((user) => {
                if (!user) {
                    return res.send('User does not exist!');
                }

                return res.send(user);
            })
            .catch((err) => res.send(err.message));
    }

    function getUserById(req, res) {
        const id = req.query.id;

        UserData.getUserById(id)
            .then((user) => {
                if (!user) {
                    return res.send('User does not exist!');
                }

                return res.send(user);
            })
            .catch((err) => res.send(err.message));
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

            return res.send('Invalid request!');
        },
        getLoginPage(req, res) {
            res.render('user/login');
        },
        getRegisterPage(req, res) {
            res.render('user/register');
        },
        registerUser(req, res) {
            if (req.user) {
                return res.send('Can not register while being logged in!');
            }

            const username = req.body.username;
            const password = req.body.password;
            const salt = encryption.getSalt();
            const hash = encryption.getHash(salt, password);
            const roles = [roleTypes.Normal];

            UserData.createUser(username, roles, salt, hash)
                .then(() => {
                    res.redirect('/login');
                })
                .catch((err) => res.send(err.message));
        },
    };
}

module.exports = { init };