const env = process.env.NODE_ENV || 'development';

const connectionStrings = {
  production: process.env.CONNECTION_STRING,
  development: 'mongodb://localhost:27017/',
};

const recognitionServers = {
  production: process.env.RECOGNITION_SERVER,
  development: 'http://localhost:4000',
};

const secrets = {
  production: process.env.SECRET,
  development: 'secret_fikret',
};

module.exports = {
  dbName: 'sys',
  environment: env,
  connectionString: connectionStrings[env],
  secret: secrets[env],
  port: process.env.PORT || 8080,
  recognitionServer: recognitionServers[env],
};
