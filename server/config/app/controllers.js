const path = require('path');
const encryption = require('../../utils/encryption');
const { getFilesIncluding } = require('../../utils/file.system');

function init(data) {
  const controllers = {};
  const files = getFilesIncluding('.controller');

  files.forEach((modulePath) => {
    const controllerModule = require(modulePath).init({
      data,
      encryption,
    });
    let moduleName = path.parse(modulePath).base;
    moduleName = moduleName.substring(0, moduleName.indexOf('.controller'));
    controllers[moduleName] = controllerModule;
  });

  return controllers;
}

module.exports = { init };
