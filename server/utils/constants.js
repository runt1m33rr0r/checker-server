const settings = require('../config/settings');

module.exports = {
  MIN_HOUR: 0,
  MAX_HOUR: 23,
  MIN_MINUTE: 0,
  MAX_MINUTE: 60,
  MIN_DAY: 1,
  MAX_DAY: 5,
  MIN_USERNAME_LEN: 5,
  MAX_USERNAME_LEN: 15,
  MIN_NAME_LEN: 3,
  MAX_NAME_LEN: 20,
  MIN_GROUP_LEN: 2,
  MAX_GROUP_LEN: 20,
  MIN_SUBJECT_LEN: 3,
  MAX_SUBJECT_LEN: 30,
  RECOGNITION_SERVER: settings.recognitionServer,
};
