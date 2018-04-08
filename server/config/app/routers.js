const { getFilesIncluding } = require('../../utils/file.system');

function init(app, controllers, middlewares) {
  const files = getFilesIncluding('.route');

  files.forEach((modulePath) => {
    require(modulePath).init({
      app,
      controllers,
      middlewares,
    });
  });
}

module.exports = { init };
