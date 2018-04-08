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

const { User } = require('./server/user/user.model');

const user = new User({
  username: 'tdedd',
  roles: ['Student', 'Teacher'],
  salt: 'dweded',
  hash: 'test',
});

console.log('saving');
user
  .save()
  .then(() => console.log('saved'))
  .catch((e) => {
    console.log(e.message);
  });
