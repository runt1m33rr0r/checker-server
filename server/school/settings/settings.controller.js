const init = ({ data: { SettingsData } }) => ({
  async checkSetup(req, res) {
    try {
      const settings = await SettingsData.getFirst();
      if (!settings) {
        return res.json({ success: true, message: 'Данни получени.', setupFinished: false });
      }

      return res.json({
        success: true,
        message: 'Данни получени.',
        setupFinished: settings.setupFinished,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async resetSetup(req, res) {
    try {
      await SettingsData.updateSettings({ setupFinished: false });
      return res.json({ success: true, message: 'Настройките бяха обновени!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
});

module.exports = { init };
