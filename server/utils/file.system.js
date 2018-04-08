const path = require('path');
const glob = require('glob');

function getFilesIncluding(inc) {
  const searchPath = path.join(__dirname, '../');
  return glob.sync(`${searchPath}/**/*${inc}*`);
}

module.exports = { getFilesIncluding };
