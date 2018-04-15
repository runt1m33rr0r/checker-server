const init = () => ({
  getHome(req, res) {
    res.status(200).json({ success: 'true', message: 'Hello!' });
  },
});

module.exports = { init };
