const jwt = require('jsonwebtoken');
const settings = require('../config/settings');

function init() {
  return {
    isAuthenticated(req, res, next) {
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(401).send({
          message: 'No token provided.',
        });
      }

      jwt.verify(token, settings.secret, (err, decoded) => {
        if (err) {
          return res.status(500).send({
            message: 'Failed to authenticate token.',
          });
        }

        req.username = decoded.username;
        req.roles = decoded.roles;
        next();
      });
    },
    isInRole(role) {
      return (req, res, next) => {
        if (req.isAuthenticated() && req.user.roles.indexOf(role) !== -1) {
          return next();
        }

        res.redirect('/unauthorized');
      };
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

module.exports = { init };
