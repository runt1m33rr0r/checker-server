const https = require('https');

// keep heroku from putting our server to sleep
setInterval(() => {
  try {
    https.get('https://school-system-server.herokuapp.com/');
  } catch (e) {
    console.log(e.message);
  }
}, 300000); // ping it every 5 minutes (300000)

require('./server/config').init();
