function init({
    data,
}) {
    const {
        GroupData,
        SubjectData,
        TimeslotData,
    } = data;

    function getValidSubjects(subjects) {
        let validSubjectCodes = [];
        let subjectPromises = [];

        subjects.forEach((subject) => {
            const promise = SubjectData.getSubjectByCode(subject)
                .then((result) => {
                    if (result) {
                        validSubjectCodes.push(result.code);
                    }
                });
            subjectPromises.push(promise);
        });

        return Promise.all(subjectPromises)
            .then(() => {
                return Promise.resolve(validSubjectCodes);
            });
    }

    function updateGroupSubjects(groupName, subjectCodes) {
        return getValidSubjects(subjectCodes)
            .then((subjects) => {
                return GroupData.updateGroupSubjects(
                    groupName,
                    subjects);
            });
    }

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
        getGroupsSettingsPage(req, res) {
            let allGroups = GroupData.getAll();
            let allSubjects = SubjectData.getAll();

            Promise.all([allGroups, allSubjects])
                .then((result) => {
                    const groups = result[0];
                    const subjects = result[1];

                    res.render('school/settings/groups', {
                        groups: groups,
                        subjects: subjects,
                    });
                })
                .catch((err) => res.render('base/error', {
                    error: err,
                }));
        },
        saveBaseSettings(req, res) {
            const groups = req.body.groups;

            if (!groups) {
                return res.status(500).json({
                    message: 'Missing groups!',
                });
            }

            GroupData.clean()
                .then(() => {
                    return GroupData.createGroups(groups);
                })
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

            SubjectData.clean()
                .then(() => {
                    return SubjectData.createSubjects(subjects);
                })
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

            TimeslotData.clean()
                .then(() => {
                    return TimeslotData.createTimeslots(timeslots);
                })
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
        saveGroupsSettings(req, res) {
            const groups = req.body.groups;

            if (!groups || !Array.isArray(groups) || groups.length < 1) {
                return res.status(500).json({
                    message: 'Missing groups!',
                });
            }

            let updates = [];
            for (let group of groups) {
                if (!group.subjects ||
                    !Array.isArray(group.subjects)) {
                    return res.status(400).json({
                        message: 'Invalid group subjects!',
                    });
                }

                updates.push(updateGroupSubjects(group.name, group.subjects));
            }

            Promise.all(updates)
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