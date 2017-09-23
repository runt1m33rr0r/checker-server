const Generator = require('../../utils/timetable-generator');

function init({
    data,
}) {
    const {
        GroupData,
        SubjectData,
        TimeslotData,
        TeacherData,
        LessonData,
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
        getGenerateTimetablePage(req, res) {
            res.render('school/timetable/generate');
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
        getAllGroups(req, res) {
            GroupData.getAll()
                .then((data) => {
                    res.status(200).json({
                        groups: data,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: err.message,
                    });
                });
        },
        getAllSubjects(req, res) {
            SubjectData.getAll()
                .then((data) => {
                    res.status(200).json({
                        subjects: data,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: err.message,
                    });
                });
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

                const update = SubjectData.getSubjectsByCodes(group.subjects)
                    .then((subjects) => {
                        return GroupData.updateGroupSubjects(
                            group.name,
                            subjects);
                    });

                updates.push(update);
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
        generateTimetable(req, res) {
            const timeslotsPromise = TimeslotData.getAll();
            const teachersPromise = TeacherData.getAll();
            const subjectsPromise = SubjectData.getAll();
            const groupsPromise = GroupData.getAll();

            let lessons = [];

            Promise.all([
                timeslotsPromise,
                teachersPromise,
                subjectsPromise,
                groupsPromise,
            ])
            .then((data) => {
                const timeslots = data[0];
                const teachers = data[1];
                const subjects = data[2];
                const groups = data[3];

                const generator = new Generator(
                    timeslots,
                    teachers,
                    subjects,
                    groups);
                lessons = generator.getReadyTimetable().lessons;
                return lessons;
            })
            .then((lessons) => {
                if (!Array.isArray(lessons)) {
                    return Promise.reject({
                        message: 'Невалидна програма!',
                    });
                }

                const checks = [];
                for (let lesson of lessons) {
                    if (!lesson.timeslot) {
                        return Promise.reject({
                            message: 'Невалидно време!',
                        });
                    }

                    const check = TimeslotData.getByID(lesson.timeslot._id)
                        .then((result) => {
                            if (!result) {
                                return Promise.reject({
                                    message: 'Невалидно време!',
                                });
                            }
                        });
                    checks.push(check);
                }
                return Promise.all(checks);
            })
            .then(() => {
                return LessonData.createLessons(lessons);
            })
            .then(() => {
                res.redirect('/');
            })
            .catch((err) => res.render('base/error', {
                error: err,
            }));
        },
    };
}

module.exports = {
    init,
};