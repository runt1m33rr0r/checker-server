const BaseData = require('../../base/base.data');

class LessonData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Lesson,
        } = models;
        this.Lesson = Lesson;
    }

    _checkUnique(groupName, subjectCode, teacherUsername, timeslot) {
        return this.collection.findOne({
                groupName: groupName,
                subjectCode: subjectCode,
                teacherUsername: teacherUsername,
                timeslot: timeslot,
            })
            .then((result) => {
                if (result) {
                    return Promise.reject({
                        message: 'Такъв час вече съществува!',
                    });
                }
            });
    }

    createLessons(lessons) {
        if (!Array.isArray(lessons)) {
            return Promise.reject({
                message: 'Invalid lessons!',
            });
        }

        let checks = [];
        let lessonModels = [];
        for (let lesson of lessons) {
            const check = this._checkUnique(
                    lesson.group,
                    lesson.subject,
                    lesson.teacher,
                    lesson.timeslot)
                .then(() => {
                    lessonModels.push(new this.Lesson(
                        lesson.group,
                        lesson.subject,
                        lesson.teacher,
                        lesson.timeslot));
                });
            checks.push(check);
        }

        return Promise.all(checks)
            .then(() => {
                return this.createManyEntries(lessonModels);
            });
    }

    createLesson(groupName, subjectCode, teacherUsername, timeslot) {
        this._checkUnique(groupName, subjectCode, teacherUsername, timeslot)
            .then(() => {
                const model = new this.Lesson(
                    groupName,
                    subjectCode,
                    teacherUsername,
                    timeslot);

                return this.createEntry(model);
            });
    }

    getLessonsByGroupName(groupName) {
        return this.collection.find({
            groupName: groupName,
        }).toArray();
    }
}

module.exports = LessonData;