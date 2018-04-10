const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
// const settings = require('../settings');

function init() {
  const app = express();

  app.use(bodyParser.json({ limit: '50mb' }));

  // if (settings.environment === 'development') {
  //   app.use(cors());
  // }
  app.use(cors());

  return app;
}

module.exports = { init };
