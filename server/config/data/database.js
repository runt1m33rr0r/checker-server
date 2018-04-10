const { MongoClient } = require('mongodb');

const settings = require('../settings');

function init() {
  return MongoClient.connect(settings.connectionString).then(client => client.db(settings.dbName));
}

module.exports = { init };
