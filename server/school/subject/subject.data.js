const BaseData = require('../../base/base.data');

class SubjectData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Subject,
        } = models;
        this.Subject = Subject;
    }

    createSubjects(subjectsArray) {
        let subjectModels = [];
        let checks = [];

        for (let subject of subjectsArray) {
            const subjectCode = subject.code;
            const subjectName = subject.name;
            const teachers = subject.teachers;

            const check = this.getSubjectByCode(subjectCode)
                .then((result) => {
                    if (result) {
                        return Promise.reject({
                            message: 'Такива предмети вече съществуват!',
                        });
                    }

                    subjectModels.push(
                        new this.Subject(subjectName, subjectCode, teachers));
                });
            checks.push(check);
        }

        return Promise.all(checks)
            .then(() => {
                return this.createManyEntries(subjectModels);
            });
    }

    addTeacherToSubject(username, subjectCode) {
        if (!username || typeof username !== 'string' || username.length < 5) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        return this.getSubjectByCode(subjectCode)
            .then((subject) => {
                this.collection.updateOne({
                    code: subject.code,
                }, {
                    $push: {
                        teachers: username,
                    },
                });
            });
    }

    addTeacherToSubjects(username, subjectCodes) {
        let updates = [];
        for (let subject of subjectCodes) {
            updates.push(
                this.addTeacherToSubject(username, subject));
        }
        return Promise.all(updates);
    }

    getSubjectByCode(code) {
        if (!code) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        return this.collection.findOne({
            code: code,
        });
    }

    getSubjectsByCodes(codes) {
        let validSubjectCodes = [];
        let subjectPromises = [];

        codes.forEach((code) => {
            const promise = this.getSubjectByCode(code)
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

    getSubjectByName(name) {
        if (!name) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        return this.collection.findOne({
            name: name,
        });
    }
}

module.exports = SubjectData;