function init() {
  return {
    getHome(req, res) {
      res.render('home');
    },
    getHelp(req, res) {
      res.render('help');
    },
    redirectHome(req, res) {
      res.redirect('/home');
    },
  };
}

module.exports = { init };
