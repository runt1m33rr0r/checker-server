const init = () => ({
  async getHome(req, res) {
    return res.status(200).json({ success: 'true', message: 'Hello!' });
  },
});

module.exports = { init };
