const mongoose = require('mongoose');

function init(connectionString) {
  mongoose.connect(connectionString);
}

module.exports = { init };
