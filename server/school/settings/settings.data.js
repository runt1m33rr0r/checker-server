const BaseData = require('../../base/base.data');

class SettingsData extends BaseData {
  updateSettings(newSettings) {
    if (typeof newSettings !== 'object' || typeof newSettings.setupFinished !== 'boolean') {
      return Promise.reject(new Error('Невалидни настройки!'));
    }

    const { setupFinished } = newSettings;

    return this.getFirst().then((settings) => {
      if (!settings) {
        const { Setting } = this.models;
        return this.createEntry(new Setting(setupFinished));
      }
      return this.collection.findOneAndUpdate({}, { $set: { setupFinished } });
    });
  }
}

module.exports = SettingsData;
