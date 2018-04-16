const BaseData = require('../../base/base.data');

class SettingsData extends BaseData {
  async updateSettings(newSettings) {
    if (typeof newSettings !== 'object' || typeof newSettings.setupFinished !== 'boolean') {
      throw new Error('Невалидни настройки!');
    }

    const { setupFinished } = newSettings;
    if (!await this.getFirst()) {
      const { Setting } = this.models;
      return this.createEntry(new Setting(setupFinished));
    }
    return this.collection.findOneAndUpdate({}, { $set: { setupFinished } });
  }
}

module.exports = SettingsData;
