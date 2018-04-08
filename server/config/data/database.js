const mongoose = require('mongoose');

const { modifyErrors } = require('../../utils/mongoose/errors.plugin');

function init(connectionString) {
  mongoose.connect(connectionString);
  mongoose.plugin(modifyErrors);
}

module.exports = { init };
