const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const settings = require('../settings');

function init() {
  const app = express();

  app.use(bodyParser.json());

  if (settings.environment === 'development') {
    app.use(cors());
  }

  return app;
}

module.exports = { init };
