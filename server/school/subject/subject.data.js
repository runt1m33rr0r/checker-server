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
                    console.log(result);
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

    getSubjectByCode(code) {
        if (!code) {
            return Promise.reject({
                message: 'Code not specified!',
            });
        }

        return this.collection.findOne({
            code: code,
        });
    }

    getSubjectByName(name) {
        if (!name) {
            return Promise.reject({
                message: 'Name not specified!',
            });
        }

        return this.collection.findOne({
            name: name,
        });
    }
}

module.exports = SubjectData;