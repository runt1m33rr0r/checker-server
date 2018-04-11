const { validateBool } = require('../../utils/validators');
const BaseModel = require('../../base/base.model');

class Settings extends BaseModel {
  constructor(setupFinished) {
    super();

    if (!setupFinished) {
      this.setupFinished = false;
    }

    validateBool({ input: setupFinished, errorMessage: 'Невалидни настройки!' });

    this.setupFinished = setupFinished;
  }
}

module.exports = Settings;
