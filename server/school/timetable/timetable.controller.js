function init({
    data,
}) {
    const {
        GroupData,
        SubjectData,
        TimeslotData,
    } = data;

    return {
        getBaseSettingsPage(req, res) {
            res.render('school/settings/base');
        },
        getSubjectSettingsPage(req, res) {
            res.render('school/settings/subjects');
        },
        getTimetableSettingsPage(req, res) {
            res.render('school/settings/timetable');
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
        saveSubjectSettings(req, res) {
            const subjects = req.body.subjects;

            if (!subjects) {
                return res.status(500).json({
                    message: 'Missing subjects!',
                });
            }

            SubjectData.createSubjects(subjects)
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
        saveTimetableSettings(req, res) {
            const timeslots = req.body.timeslots;

            if (!timeslots) {
                return res.status(500).json({
                    message: 'Missing timeslots!',
                });
            }

            TimeslotData.createTimeslots(timeslots)
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