/* global __dirname */

const path = require('path');
const fileWalker = require('../../utils/file.system').walkDirectorySync;

function init(app, controllers, middlewares) {
    const searchPath = path.join(__dirname, '../../');

    fileWalker(searchPath, (file) => {
        if (file.includes('.route')) {
            const modulePath = file;
            require(modulePath).init({ app, controllers, middlewares });
        }
    });
}

module.exports = { init };