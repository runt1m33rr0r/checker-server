const { getFilesIncluding } = require('../../utils/file.system');

function init(db, models) {
  const data = {};
  const dataFiles = getFilesIncluding('.data');

  dataFiles.forEach((file) => {
    const DataModule = require(file);
    const dataObject = new DataModule(db, models);
    const moduleName = dataObject.constructor.name;
    data[moduleName] = dataObject;
  });

  return data;
}

module.exports = { init };
