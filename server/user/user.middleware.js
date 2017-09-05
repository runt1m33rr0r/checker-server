const passport = require('passport');

function init() {
    return {
        isAuthenticated(req, res, next) {
            if (!req.isAuthenticated()) {
                return res.status(403).send('unauthorized');
            }
            next();
        },
        isInRole(role) {
            return (req, res, next) => {
                if (req.isAuthenticated() &&
                    req.user.roles.indexOf(role) !== -1) {
                    return next();
                }

                res.status(403).send('unauthorized');
            };
        },
        loginLocal(req, res) {
            if (req.user) {
                return res.send('Already logged in!');
            }

            passport.authenticate('local', (error, user, info) => {
                if (error || !user) {
                    return res.send(info.message);
                }

                req.logIn(user, (err) => {
                    if (err) {
                        return res.send(error);
                    }

                    return res.redirect('/');
                });
            })(req, res);
        },
        logoutUser(req, res) {
            if (!req.user) {
                return res.send('Not logged in!');
            }

            req.logout();
            res.redirect('/');
        },
    };
}

module.exports = { init };