const path = require('path');

const { getFilesIncluding } = require('../../utils/file.system');

const getBaseName = file => path.basename(file, path.extname(file)).replace('.model', '');

const init = () => {
  const models = {};
  const files = getFilesIncluding('.model');

  files.forEach((file) => {
    if (getBaseName(file) !== 'base') {
      const modelPath = file;
      const modelModule = require(modelPath);
      models[modelModule.name] = modelModule;
    }
  });

  return models;
};

module.exports = { init };
