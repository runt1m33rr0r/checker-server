const bodyParser = require('body-parser');
const express = require('express');

function init() {
  const app = express();

  app.use(bodyParser.json());

  return app;
}

module.exports = { init };
