/* eslint no-console: 0 */

const settings = require('./settings');

function init() {
  require('./data/database')
    .init()
    .then((db) => {
      const app = require('./app/app').init();
      const models = require('./data/models').init();
      const data = require('./data/data').init(db, models);
      const controllers = require('./app/controllers').init(data);
      const middlewares = require('./app/middlewares').init(data);
      require('./app/routers').init(app, controllers, middlewares);

      app.listen(settings.port, () => console.log(`working at :${settings.port}`));
    })
    .catch(err => console.log(err));
}

module.exports = { init };
