const path = require('path');

const { getFilesIncluding } = require('../../utils/file.system');

const getBaseName = file => path.basename(file, path.extname(file)).replace('.data', '');

const init = (db, models) => {
  const data = {};
  const dataFiles = getFilesIncluding('.data');

  dataFiles.forEach((file) => {
    if (getBaseName(file) !== 'base') {
      const DataModule = require(file);
      const dataObject = new DataModule(db, models);
      const moduleName = dataObject.constructor.name;
      data[moduleName] = dataObject;
    }
  });

  return data;
};

module.exports = { init };
