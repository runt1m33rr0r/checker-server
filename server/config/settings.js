const path = require('path');

const rootPath = path.join(__dirname, '/../../');
const env = process.env.NODE_ENV || 'development';

const connectionStrings = {
    production: process.env.CONNECTION_STRING,
    development: 'mongodb://localhost:27017/sys',
};

const secrets = {
    production: process.env.SECRET,
    development: 'secret_fikret',
};

module.exports = {
    environment: env,
    connectionString: connectionStrings[env],
    secret: secrets[env],
    port: process.env.PORT || 8080,
    rootPath,
};