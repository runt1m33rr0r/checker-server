const path = require('path');
const { getFilesIncluding } = require('../../utils/file.system');

function init(data) {
  const middlewares = {};
  const files = getFilesIncluding('.middleware');

  files.forEach((modulePath) => {
    const middlewareModule = require(modulePath).init(data);
    let moduleName = path.parse(modulePath).base;
    moduleName = moduleName.substring(0, moduleName.indexOf('.middleware'));
    middlewares[moduleName] = middlewareModule;
  });

  return middlewares;
}

module.exports = { init };
