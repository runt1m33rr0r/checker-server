/* eslint no-process-env: 0 */
/* eslint no-console: 0 */

const settings = require('./settings');

async function init() {
    const db = await require('./data/database').init(settings.connectionString);
    const data = require('./data/data').init(db);
    const app = require('./app/app').init(db);
    require('./app/passport').init(app, data);
    const controllers = require('./app/controllers').init(data);
    const middlewares = require('./app/middlewares').init();
    require('./app/routers').init(app, controllers, middlewares);

    app.listen(
        settings.port,
        () => console.log(`working at :${settings.port}`));
}

module.exports = { init };