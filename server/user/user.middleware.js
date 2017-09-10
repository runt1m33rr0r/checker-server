const passport = require('passport');

function init() {
    return {
        isAuthenticated(req, res, next) {
            if (!req.isAuthenticated()) {
                return res.redirect('/unauthorized');
            }
            next();
        },
        isInRole(role) {
            return (req, res, next) => {
                if (req.isAuthenticated() &&
                    req.user.roles.indexOf(role) !== -1) {
                    return next();
                }

                res.redirect('/unauthorized');
            };
        },
        loginLocal(req, res, next) {
            if (req.user) {
                return res.redirect('/unauthorized');
            }

            passport.authenticate('local', (error, user, info) => {
                if (error || !user) {
                    return res.render('base/error', {
                        error: {
                            message: info.message,
                        },
                    });
                }

                req.logIn(user, (err) => {
                    if (err) {
                        return res.render('base/error', {
                            error: err,
                        });
                    }

                    return res.redirect('/');
                });
            })(req, res, next);
        },
        logoutUser(req, res) {
            if (!req.user) {
                return res.redirect('/unauthorized');
            }

            req.logout();
            res.redirect('/');
        },
    };
}

module.exports = {
    init,
};