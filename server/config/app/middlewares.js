const { getFilesIncluding, getBaseName } = require('../../utils/file.system');

function init(data) {
  const middlewares = {};
  const ext = '.middleware';
  const files = getFilesIncluding(ext);

  files.forEach((file) => {
    const MiddlewareModule = require(file);
    const middlewareObject = new MiddlewareModule(data);
    middlewares[getBaseName(file, ext)] = middlewareObject;
  });

  return middlewares;
}

module.exports = { init };
