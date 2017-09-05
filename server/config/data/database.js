const { MongoClient } = require('mongodb');

function init(connectionString) {
    return MongoClient.connect(connectionString);
}

module.exports = { init };