/* globals __dirname */

const path = require('path');
const encryption = require('../../utils/encryption');
const fileWalker = require('../../utils/file.system').walkDirectorySync;

function init(data) {
    const controllers = {};
    const searchPath = path.join(__dirname, '../../');

    fileWalker(searchPath, (file) => {
        if (file.includes('.controller')) {
            const modulePath = file;
            const controllerModule = require(modulePath)
                .init({ data, encryption });
            let moduleName = path.parse(modulePath).base;
            moduleName = moduleName.substring(
                0,
                moduleName.indexOf('.controller'));
            controllers[moduleName] = controllerModule;
        }
    });

    return controllers;
}

module.exports = { init };