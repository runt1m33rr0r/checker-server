const { getFilesIncluding } = require('../../utils/file.system');

const init = () => {
  const models = {};
  const files = getFilesIncluding('.model');

  files.forEach((file) => {
    const modelPath = file;
    const modelModule = require(modelPath);
    const moduleName = modelModule.name;
    models[moduleName] = modelModule;
  });

  return models;
};

module.exports = { init };
