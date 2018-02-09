const BaseData = require('../base/base.data');

class SettingsData extends BaseData {
  constructor(db, models) {
    super(db);

    const { Setting } = models;
    this.Setting = Setting;
  }

  updateSettings(newSettings) {
    if (typeof newSettings !== 'object' || typeof newSettings.setupFinished !== 'boolean') {
      return Promise.reject(new Error('Невалидни настройки!'));
    }

    const { setupFinished } = newSettings;

    return this.getFirst().then((settings) => {
      if (!settings) {
        return this.createEntry(new this.Setting(setupFinished));
      }
      return this.collection.findOneAndUpdate({}, { $set: { setupFinished } });
    });
  }
}

module.exports = SettingsData;
