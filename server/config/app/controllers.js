const encryption = require('../../utils/encryption');
const { getFilesIncluding, getBaseName } = require('../../utils/file.system');

function init(data) {
  const controllers = {};
  const ext = '.controller';
  const files = getFilesIncluding(ext);

  files.forEach((file) => {
    const ControllerModule = require(file);
    const controllerObject = new ControllerModule(data, encryption);
    controllers[getBaseName(file, ext)] = controllerObject;
  });

  return controllers;
}

module.exports = { init };
