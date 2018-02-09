const { MongoClient } = require('mongodb');

async function init(connectionString, dbName, callback) {
  MongoClient.connect(connectionString, (err, client) => {
    callback(client.db(dbName), err);
  });
}

module.exports = { init };
