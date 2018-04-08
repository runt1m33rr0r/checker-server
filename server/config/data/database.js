const mongoose = require('mongoose');

const { modifyErrors } = require('../../utils/mongoose/errors.plugin');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

function init(connectionString) {
  mongoose.connect(connectionString);
  mongoose.plugin(beautifyUnique);
  mongoose.plugin(modifyErrors);
}

module.exports = { init };
