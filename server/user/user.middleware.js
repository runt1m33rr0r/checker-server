const encryption = require('../utils/encryption');

const STATUS = 200;

function init(data) {
  const { UserData } = data;

  return {
    isAuthenticated(req, res, next) {
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(STATUS).send({
          success: false,
          message: 'No token provided.',
        });
      }

      const decoded = encryption.verifyToken(token);
      if (!decoded) {
        return res.status(STATUS).send({
          success: false,
          message: 'Failed to authenticate token.',
        });
      }

      UserData.getUserByUsername(decoded.username)
        .then((user) => {
          if (!user) {
            return res.status(STATUS).send({
              success: false,
              message: 'Failed to authenticate token.',
            });
          }

          req.username = decoded.username;
          req.roles = decoded.roles;
          req.isAuthenticated = true;
          next();
        })
        .catch(() =>
          res.status(STATUS).send({
            success: false,
            message: 'Failed to authenticate token.',
          }));
    },
    isInRole(role) {
      return (req, res, next) => {
        if (req.isAuthenticated && req.roles.indexOf(role) !== -1) {
          return next();
        }

        res.status(STATUS).send({
          success: false,
          message: 'Unauthorized!',
        });
      };
    },
  };
}

module.exports = { init };
