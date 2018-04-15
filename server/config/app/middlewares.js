const { getFilesIncluding, getBaseName } = require('../../utils/file.system');

function init(data) {
  const middlewares = {};
  const ext = '.middleware';
  const files = getFilesIncluding(ext);

  files.forEach((file) => {
    const middlewareModule = require(file).init(data);
    middlewares[getBaseName(file, ext)] = middlewareModule;
  });

  return middlewares;
}

module.exports = { init };
