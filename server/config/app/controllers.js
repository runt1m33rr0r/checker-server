const encryption = require('../../utils/encryption');
const { getFilesIncluding, getBaseName } = require('../../utils/file.system');

function init(data) {
  const controllers = {};
  const ext = '.controller';
  const files = getFilesIncluding(ext);

  files.forEach((file) => {
    const controllerModule = require(file).init({
      data,
      encryption,
    });
    controllers[getBaseName(file, ext)] = controllerModule;
  });

  return controllers;
}

module.exports = { init };
