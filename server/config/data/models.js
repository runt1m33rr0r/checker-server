const { getFilesIncluding, getBaseName } = require('../../utils/file.system');

const init = () => {
  const models = {};
  const ext = '.model';
  const files = getFilesIncluding(ext);

  files.forEach((file) => {
    if (getBaseName(file) !== 'base') {
      const modelModule = require(file);
      models[modelModule.name] = modelModule;
    }
  });

  return models;
};

module.exports = { init };
