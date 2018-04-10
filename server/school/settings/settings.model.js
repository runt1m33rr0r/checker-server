const { validateBool } = require('../../utils/validators');

class Settings {
  constructor(setupFinished) {
    if (!setupFinished) {
      this.setupFinished = false;
    }

    validateBool({ input: setupFinished, errorMessage: 'Невалидни настройки!' });

    this.setupFinished = setupFinished;
  }
}

module.exports = Settings;
