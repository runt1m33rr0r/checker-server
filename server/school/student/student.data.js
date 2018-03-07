const BaseData = require('../../base/base.data');
const axios = require('axios');

class StudentData extends BaseData {
  constructor(db, models) {
    super(db);

    const { Student, Absence, Check } = models;
    this.Student = Student;
    this.Absence = Absence;
    this.Check = Check;
  }

  createEncoding(image) {
    return axios
      .post('http://localhost:4000/encode', { image })
      .catch(() => Promise.reject(new Error('Сървъра не работи!')))
      .then((res) => {
        if (res.data && res.data.encoding) {
          const result = res.data.encoding;
          return Promise.resolve(result);
        } else if (res.data && res.data.message) {
          return Promise.reject(new Error('Не виждам лице на снимката!'));
        }
        return Promise.reject(new Error('Вътрешна грешка!'));
      })
      .catch(err => Promise.reject(new Error(err.message)));
  }

  verifyIdentity(username, image) {
    if (!image) {
      return Promise.reject(new Error('Вътрешна грешка!'));
    }

    return this.getStudentByUsername(username)
      .then((student) => {
        if (!student) {
          return Promise.reject(new Error('Вътрешна грешка!'));
        }

        if (!student.encoding) {
          return Promise.reject(new Error('Нямате снимка в профила си!'));
        }

        return axios
          .post('http://localhost:3000/verify', {
            image,
            encoding: student.encoding,
          })
          .catch(() => Promise.reject(new Error('Сървъра не работи!')));
      })
      .then((res) => {
        if (res.data && typeof res.data.same === 'string') {
          return Promise.resolve(res.data);
        } else if (res.data && typeof res.data.message === 'string') {
          return Promise.reject(new Error('Не виждам лице на снимката!'));
        }
        return Promise.reject(new Error('Вътрешна грешка!'));
      });
  }

  saveEncoding(username, encoding) {
    if (typeof username !== 'string' || typeof encoding !== 'string') {
      return Promise.reject(new Error('Вътрешна грешка!'));
    }

    return this.collection.findOneAndUpdate(
      {
        username,
      },
      {
        $set: {
          encoding,
        },
      },
    );
  }

  addCheck(username, day, hour, minute) {
    if (!username) {
      return Promise.reject(new Error('Невалидно потребителски име!'));
    }

    return this.collection.findOneAndUpdate(
      {
        username,
      },
      {
        $push: {
          checks: new this.Check(day, hour, minute),
        },
      },
    );
  }

  clearChecks(username) {
    if (!username) {
      return Promise.reject(new Error('Невалидно потребителски име!'));
    }

    return this.collection.findOneAndUpdate(
      {
        username,
      },
      {
        $set: {
          checks: [],
        },
      },
    );
  }

  createStudent(firstName, lastName, username, group) {
    return this.getStudentByUsername(username).then((result) => {
      if (result) {
        return Promise.reject(new Error('Невалидни данни!'));
      }

      const studentModel = new this.Student(firstName, lastName, username, group);
      return this.createEntry(studentModel);
    });
  }

  getStudentByUsername(username) {
    if (!username) {
      return Promise.reject(new Error('Невалидно потребителски име!'));
    }

    return this.collection.findOne({ username });
  }

  addAbsence(username, day, hour, minute, subject) {
    if (!username) {
      return Promise.reject(new Error('Невалидно потребителски име!'));
    }

    return this.collection.findOneAndUpdate(
      {
        username,
      },
      {
        $push: {
          absences: new this.Absence(day, hour, minute, subject),
        },
      },
    );
  }
}

module.exports = StudentData;
