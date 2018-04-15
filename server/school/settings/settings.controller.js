const BaseController = require('../../base/base.controller');

class SettingsController extends BaseController {
  checkSetup(req, res) {
    this.data.settings
      .getFirst()
      .then((settings) => {
        if (!settings) {
          return res.json({ success: true, message: 'Данни получени.', setupFinished: false });
        }
        res.json({
          success: true,
          message: 'Данни получени.',
          setupFinished: settings.setupFinished,
        });
      })
      .catch(err => res.json({ success: false, message: err.message }));
  }

  resetSetup(req, res) {
    this.data.settings
      .getFirst()
      .then((settings) => {
        if (!settings) {
          return res.json({ success: false, message: 'Няма настройки!' });
        }

        return this.data.settings.updateSettings({ setupFinished: false });
      })
      .then(() => res.json({ success: true, message: 'Настройките бяха обновени!' }))
      .catch(err => res.json({ success: false, message: err.message }));
  }
}

module.exports = SettingsController;
