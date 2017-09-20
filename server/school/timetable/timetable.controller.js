function init({
    data,
}) {
    const {
        GroupData,
    } = data;

    return {
        getBaseSettingsPage(req, res) {
            res.render('school/settings/base');
        },
        saveBaseSettings(req, res) {
            const groups = req.body.groups;

            if (!groups) {
                return res.status(500).json({
                    message: 'Missing groups!',
                });
            }

            GroupData.createGroups(groups)
                .then(() => {
                    res.status(200).json({
                        message: 'cool',
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        message: err.message,
                    });
                });
        },
    };
}

module.exports = {
    init,
};