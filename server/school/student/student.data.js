const BaseData = require('../../base/base.data');

class StudentData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Student,
        } = models;
        this.Student = Student;
    }

    createStudent(firstName, lastName, username, group) {
        return this.getStudentByUsername(username)
            .then((result) => {
                if (result) {
                    return Promise.reject({
                        message: 'Student already exists!',
                    });
                }

                const studentModel = new this.Student(
                    firstName,
                    lastName,
                    username,
                    group);
                return this.createEntry(studentModel);
            });
    }

    getStudentByUsername(username) {
        if (!username) {
            return Promise.reject({
                message: 'Username not specified!',
            });
        }

        return this.collection.findOne({
            username: username,
        });
    }
}

module.exports = StudentData;