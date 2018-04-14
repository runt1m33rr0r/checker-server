const encryption = require('../utils/encryption');

function init(data) {
  const { UserData } = data;

  return {
    isAuthenticated: (req, res, next) => {
      if (!req.headers.authorization) {
        return res.send({ success: false, message: 'Ivalid headers!' });
      }

      const tokenData = req.headers.authorization.split(' ');
      const type = tokenData[0];
      const token = tokenData[1];
      if (!token || !type || type !== 'Bearer') {
        return res.send({
          success: false,
          message: 'No token provided.',
        });
      }

      const decoded = encryption.verifyToken(token);
      if (!decoded) {
        return res.send({
          success: false,
          message: 'Failed to authenticate token.',
        });
      }

      UserData.getUserByUsername(decoded.username)
        .then((user) => {
          if (!user) {
            return res.send({
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
          res.send({
            success: false,
            message: 'Failed to authenticate token.',
          }));
    },
    isInRole: role => (req, res, next) => {
      this.isAuthenticated(req, res, () => {
        if (req.isAuthenticated && req.roles.indexOf(role) !== -1) {
          return next();
        }

        res.send({
          success: false,
          message: 'Unauthorized!',
        });
      });
    },
  };
}

module.exports = { init };
