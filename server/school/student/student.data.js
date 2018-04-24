const BaseData = require('../../base/base.data');
const axios = require('axios');

class StudentData extends BaseData {
  async createEncoding(image) {
    if (typeof image !== 'string' || image.length < 1) {
      throw new Error('Невалидно изображение!');
    }

    let res = {};
    try {
      res = await axios.post('http://localhost:4000/encode', { image });
    } catch (error) {
      throw new Error('Сървъра не работи!');
    }

    if (res.data && res.data.encoding) {
      return res.data.encoding;
    }

    if (res.data && res.data.message) {
      throw new Error('Не виждам лице на снимката!');
    }

    throw new Error('Вътрешна грешка!');
  }

  async verifyIdentity(username, image) {
    if (!image || typeof image !== 'string' || image.length < 1) {
      throw new Error('Невалидно изображение!');
    }

    const student = await this.getStudentByUsername(username);
    if (!student) {
      throw new Error('Няма такъв ученик!');
    }

    if (!student.encoding) {
      throw new Error('Нямате снимка в профила си!');
    }

    let res = {};
    try {
      res = axios.post('http://localhost:3000/verify', { image, encoding: student.encoding });
    } catch (error) {
      throw new Error('Сървъра не работи!');
    }

    if (!res.data || typeof res.data.same !== 'string') {
      throw new Error('Вътрешна грешка!');
    }

    if (res.data.same !== 'True') {
      throw new Error('Лицето на снимката не е ваше!');
    }

    if (res.data && typeof res.data.message === 'string') {
      throw new Error('Не виждам лице на снимката!');
    }
    throw new Error('Вътрешна грешка!');
  }

  async saveEncoding(username, encoding) {
    if (typeof username !== 'string' || typeof encoding !== 'string') {
      throw new Error('Невалидни данни!');
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

  async addCheck(username, day, hour, minute) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    const { Check } = this.models;
    return this.collection.findOneAndUpdate(
      {
        username,
      },
      {
        $push: {
          checks: new Check(day, hour, minute),
        },
      },
    );
  }

  async clearChecks(username) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
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

  async createStudent(firstName, lastName, username, groups) {
    if (await this.getStudentByUsername(username)) {
      throw new Error('Вече има такъв ученик!');
    }

    const { Student } = this.models;
    const studentModel = new Student(firstName, lastName, username, groups);
    return this.createEntry(studentModel);
  }

  async getStudentByUsername(username) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    return this.collection.findOne({ username });
  }

  async addAbsence(username, day, hour, minute, subject) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    const { Absence } = this.models;
    return this.collection.findOneAndUpdate(
      {
        username,
      },
      {
        $push: {
          absences: new Absence(day, hour, minute, subject),
        },
      },
    );
  }
}

module.exports = StudentData;
