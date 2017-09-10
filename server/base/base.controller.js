function init() {
    return {
        getHome(req, res) {
            res.render('home');
        },
        redirectHome(req, res) {
            res.redirect('/home');
        },
    };
}

module.exports = {
    init,
};