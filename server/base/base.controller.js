class BaseController {
  constructor(data, encryption) {
    this.data = data;
    this.encryption = encryption;
  }

  getHome(req, res) {
    res.status(200).json({ success: 'true', message: 'Hello!' });
  }
}

module.exports = BaseController;
