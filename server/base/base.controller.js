const init = () => ({
  async getHome(req, res) {
    return res.json({
      success: 'true',
      message: `Hello! The current date and time are ${new Date()}`,
    });
  },
});

module.exports = { init };
