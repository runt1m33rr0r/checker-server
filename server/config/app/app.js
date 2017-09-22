const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const settings = require('../settings');

function setupStatics(app) {
    const bootstrapPath = path.join(
        __dirname,
        '../../../node_modules/bootstrap');
    const fontAwesome = path.join(
        __dirname,
        '../../../node_modules/font-awesome');
    const jqueryPath = path.join(__dirname, '../../../node_modules/jquery');
    const popperPath = path.join(__dirname, '../../../node_modules/popper.js');
    const momentPath = path.join(__dirname, '../../../node_modules/moment');
    const staticsPath = path.join(__dirname, '../../../public');

    app.use('/public', express.static(jqueryPath));
    app.use('/public', express.static(popperPath));
    app.use('/public', express.static(bootstrapPath));
    app.use('/public', express.static(fontAwesome));
    app.use('/public', express.static(momentPath));

    app.use('/public', express.static(staticsPath));
}

function init(db) {
    const app = express();

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../../../server/views'));

    setupStatics(app);

    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
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