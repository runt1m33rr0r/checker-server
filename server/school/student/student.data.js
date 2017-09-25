const BaseData = require('../../base/base.data');
const axios = require('axios');

class StudentData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Student,
        } = models;
        this.Student = Student;
    }

    createEncoding(image) {
        return axios.post('http://localhost:3000/encode', {
                'image': new Buffer(image).toString('base64'),
            })
            .catch(() => {
                return Promise.reject({
                    message: 'Сървъра не работи!',
                });
            })
            .then((res) => {
                if (res.data && res.data.encoding) {
                    const result = res.data.encoding;
                    return Promise.resolve(result);
                } else if (res.data && res.data.message) {
                    return Promise.reject({
                        message: 'Не виждам лице на снимката!',
                    });
                } else {
                    return Promise.reject({
                        message: 'Internal error',
                    });
                }
            })
            .catch((err) => {
                return Promise.reject({
                    message: err.message,
                });
            });
    }

    verifyIdentity(username, image) {
        if (!image) {
            return Promise.reject({
                message: 'Internal error',
            });
        }

        return this.getStudentByUsername(username)
            .then((student) => {
                if (!student) {
                    return Promise.reject({
                        message: 'Internal error',
                    });
                }

                if (!student.encoding) {
                    return Promise.reject({
                        message: 'Нямате снимка в профила си!',
                    });
                }

                return axios.post('http://localhost:3000/verify', {
                        'image': new Buffer(image).toString('base64'),
                        'encoding': student.encoding,
                    })
                    .catch(() => {
                        return Promise.reject({
                            message: 'Сървъра не работи!',
                        });
                    });
            })
            .then((res) => {
                if (res.data && typeof res.data.same === 'string') {
                    return Promise.resolve(res.data);
                } else if (res.data && typeof res.data.message === 'string') {
                    return Promise.reject({
                        message: 'Не виждам лице на снимката!',
                    });
                } else {
                    return Promise.reject({
                        message: 'Internal error',
                    });
                }
            });
    }

    saveEncoding(username, encoding) {
        if (typeof username !== 'string' ||
            typeof encoding !== 'string') {
            return Promise.reject({
                message: 'Internal error!',
            });
        }

        return this.collection.findOneAndUpdate({
            username: username,
        }, {
            $set: {
                'encoding': encoding,
            },
        });
    }

    addCheck(username, check) {
        if (typeof username !== 'string' ||
            typeof check.day !== 'number' ||
            typeof check.hour !== 'number' ||
            typeof check.minute !== 'number') {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        return this.collection.findOneAndUpdate({
            username: username,
        }, {
            $push: {
                checks: check,
            },
        });
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