const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryption = require('../../utils/encryption');

function init(app, data) {
    const {
        UserData,
    } = data;

    passport.use(new LocalStrategy((username, password, done) => {
        UserData.getUserByUsername(username)
            .then((user) => {
                if (!user) {
                    return done(null, false, {
                        message: 'Неправилни данни!',
                    });
                }

                if (!UserData.checkPassword(
                        password,
                        user.salt,
                        user.hashedPass,
                        encryption)) {
                    return done(null, false, {
                        message: 'Неправилни данни!',
                    });
                }

                return done(null, user);
            });
    }));

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser((id, done) => {
        UserData.getUserById(id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch((error) => done(error, false));
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            const username = req.user.username;
            const roles = req.user.roles;
            res.locals.user = {
                username,
                roles,
            };
        }
        next();
    });
}

module.exports = {
    init,
};