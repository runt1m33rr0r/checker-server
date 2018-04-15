const path = require('path');
const glob = require('glob');

const getFilesIncluding = (inc) => {
  const searchPath = path.join(__dirname, '../');
  return glob.sync(`${searchPath}/**/*${inc}*`);
};

const getBaseName = (file, extension) =>
  path.basename(file, path.extname(file)).replace(extension, '');

module.exports = { getFilesIncluding, getBaseName };
