const http = require('http');

// keep heroku from putting our server to sleep
setInterval(() => {
  http.get('https://school-system-server.herokuapp.com');
}, 300000); // ping it every 5 minutes (300000)

require('./server/config').init();
