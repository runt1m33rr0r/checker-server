const path = require('path');
const fileWalker = require('../../utils/file.system').walkDirectorySync;

const init = () => {
  const models = {};
  const searchPath = path.join(__dirname, '../../');

  fileWalker(searchPath, (file) => {
    if (file.includes('.model')) {
      const modelPath = file;
      const modelModule = require(modelPath);
      const moduleName = modelModule.name;
      models[moduleName] = modelModule;
    }
  });

  return models;
};

module.exports = { init };
