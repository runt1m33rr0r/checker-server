const fs = require('fs');
const path = require('path');

function walkDirectorySync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      return callback(filePath);
    } else if (stat.isDirectory()) {
      walkDirectorySync(filePath, callback);
    }
  });
}

module.exports = { walkDirectorySync };
