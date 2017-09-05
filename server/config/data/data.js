/* global __dirname */

const path = require('path');
const modelsLoader = require('./models');
const fileWalker = require('../../utils/file.system').walkDirectorySync;

function init(db) {
    const data = {};
    const models = modelsLoader.init();
    const searchPath = path.join(__dirname, '../../');

    fileWalker(searchPath, (file) => {
        if (file.includes('.data')) {
            const modulePath = file;
            const DataModule = require(modulePath);
            const dataObject = new DataModule(db, models);
            const moduleName = dataObject.constructor.name;
            data[moduleName] = dataObject;
        }
    });

    return data;
}

module.exports = { init };