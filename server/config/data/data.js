const { getFilesIncluding, getBaseName } = require('../../utils/file.system');

const init = (db, models) => {
  const data = {};
  const ext = '.data';
  const dataFiles = getFilesIncluding(ext);

  dataFiles.forEach((file) => {
    if (getBaseName(file) !== 'base') {
      const DataModule = require(file);
      const dataObject = new DataModule(db, models);
      data[DataModule.name] = dataObject;
    }
  });

  return data;
};

module.exports = { init };
