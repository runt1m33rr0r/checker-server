const BaseData = require('../../base/base.data');

class TeacherData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Teacher,
        } = models;
        this.Teacher = Teacher;
    }

    createTeacher(firstName, lastName, username, isLead, group, subjects) {
        return this.getTeacherByUsername(username)
            .then((result) => {
                if (result) {
                    return Promise.reject({
                        message: 'Невалидни данни!',
                    });
                }

                const teacherModel = new this.Teacher(
                    firstName,
                    lastName,
                    username,
                    isLead,
                    group,
                    subjects);
                return this.createEntry(teacherModel);
            });
    }

    getTeacherByUsername(username) {
        if (!username) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        return this.collection.findOne({
            username: username,
        });
    }
}

module.exports = TeacherData;