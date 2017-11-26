const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const settings = require('../settings');

function init(db) {
  const app = express();

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: settings.secret,
    store: new MongoStore({
      db,
    }),
    cookie: {
      maxAge: 7 * 86400000,
    },
  }));

  return app;
}

module.exports = { init };
