function init() {
    return {
        getHome(req, res) {
            res.render('home');
        },
    };
}

module.exports = { init };