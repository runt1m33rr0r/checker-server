const encryption = require('../utils/encryption');
const BaseMiddleware = require('../base/base.middleware');

class UserMiddleware extends BaseMiddleware {
  isAuthenticated(req, res, next) {
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

    this.data.user
      .getUserByUsername(decoded.username)
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
  }

  isInRole(role) {
    return (req, res, next) => {
      this.isAuthenticated(req, res, () => {
        if (req.isAuthenticated && req.roles.indexOf(role) !== -1) {
          return next();
        }

        res.send({
          success: false,
          message: 'Unauthorized!',
        });
      });
    };
  }
}

module.exports = UserMiddleware;
