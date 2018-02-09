/* eslint no-console: 0 */

const settings = require('./settings');

async function init() {
  require('./data/database').init(settings.connectionString, settings.dbName, (db) => {
    const data = require('./data/data').init(db);
    const app = require('./app/app').init();
    const controllers = require('./app/controllers').init(data);
    const middlewares = require('./app/middlewares').init(data);
    require('./app/routers').init(app, controllers, middlewares);

    app.listen(settings.port, () => console.log(`working at :${settings.port}`));
  });
}

module.exports = { init };
