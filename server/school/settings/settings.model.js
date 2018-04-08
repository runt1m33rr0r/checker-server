class Settings {
  constructor(setupFinished) {
    if (setupFinished === null || setupFinished === undefined) {
      this.setupFinished = false;
    } else if (typeof setupFinished !== 'boolean') {
      throw new Error('Невалидни настройки!');
    } else {
      this.setupFinished = setupFinished;
    }
  }
}

module.exports = Settings;
