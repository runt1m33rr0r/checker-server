/* globals __dirname */

const path = require('path');
const fileWalker = require('../../utils/file.system').walkDirectorySync;

function init() {
    const middlewares = {};
    const searchPath = path.join(__dirname, '../../');

    fileWalker(searchPath, (file) => {
        if (file.includes('.middleware')) {
            const modulePath = file;
            const middlewareModule = require(modulePath).init();
            let moduleName = path.parse(modulePath).base;
            moduleName = moduleName.substring(
                0,
                moduleName.indexOf('.middleware'));
            middlewares[moduleName] = middlewareModule;
        }
    });

    return middlewares;
}

module.exports = { init };