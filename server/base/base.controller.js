const init = () => ({
  async getHome(req, res) {
    return res.json({ success: 'true', message: 'Hello!' });
  },
});

module.exports = { init };
