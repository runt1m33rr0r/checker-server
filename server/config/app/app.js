const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const settings = require('../settings');

function setupStatics(app) {
    const materialPath = path.join(
        __dirname,
        '../../../node_modules/material-components-web');
    const normalizePath = path.join(
        __dirname,
        '../../../node_modules/normalize.css'
    );
    const jqueryPath = path.join(__dirname, '../../../node_modules/jquery');
    const staticsPath = path.join(__dirname, '../../../public');

    app.use('/public', express.static(materialPath));
    app.use('/public', express.static(normalizePath));
    app.use('/public', express.static(staticsPath));
    app.use('/public', express.static(jqueryPath));
}

function init(db) {
    const app = express();

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../../../server/views'));

    setupStatics(app);

    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: settings.secret,
        store: new MongoStore({
            db: db,
        }),
        cookie: {
            maxAge: 7 * 86400000,
        },
    }));

    return app;
}

module.exports = {
    init,
};