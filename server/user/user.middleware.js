const encryption = require('../utils/encryption');

const init = ({ UserData }) => ({
  async isAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
      return res.json({ success: false, message: 'Ivalid headers.' });
    }

    const tokenData = req.headers.authorization.split(' ');
    const type = tokenData[0];
    const token = tokenData[1];
    if (!token || !type || type !== 'Bearer') {
      return res.json({
        success: false,
        message: 'No token provided.',
      });
    }

    const decoded = encryption.verifyToken(token);
    if (!decoded) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.',
      });
    }

    try {
      const user = await UserData.getUserByUsername(decoded.username);
      if (!user) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.',
        });
      }

      req.username = decoded.username;
      req.roles = decoded.roles;
      req.isAuthenticated = true;
      next();
    } catch (error) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.',
      });
    }
  },
  isInRole(role) {
    return async (req, res, next) => {
      this.isAuthenticated(req, res, () => {
        if (req.isAuthenticated && req.roles.indexOf(role) !== -1) {
          return next();
        }

        return res.json({
          success: false,
          message: 'Unauthorized!',
        });
      });
    };
  },
});

module.exports = { init };
