const BaseData = require('../../base/base.data');

class LessonData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Lesson,
        } = models;
        this.Lesson = Lesson;
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
            const check = this.collection.findOne({
                    groupName: lesson.group,
                    subjectCode: lesson.subject,
                    teacherUsername: lesson.teacher,
                    timeslot: lesson.timeslot,
                })
                .then((result) => {
                    if (result) {
                        return Promise.reject({
                            message: 'Такива часове вече съществуват!',
                        });
                    }

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
}

module.exports = LessonData;