const { getFilesIncluding } = require('../../utils/file.system');

function init(models) {
  const data = {};
  const dataFiles = getFilesIncluding('.data');

  dataFiles.forEach((fileName) => {
    const DataModule = require(dataFiles[fileName]);
    data.push(new DataModule(models));
  });

  return data;
}

module.exports = { init };
