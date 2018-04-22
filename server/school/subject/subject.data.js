const BaseData = require('../../base/base.data');

class SubjectData extends BaseData {
  async createSubjects(subjectsArray) {
    // input data duplicate check missing
    const subjectModels = [];
    const checks = [];
    const { Subject } = this.models;

    for (const subject of subjectsArray) {
      const { teachers, subjectCode, subjectName } = subject;

      subjectModels.push(new Subject(subjectName, subjectCode, teachers));
      checks.push(this.getSubjectByCode(subjectCode));
    }

    if ((await Promise.all(checks)).length > 0) {
      throw new Error('Такива предмети вече съществуват!');
    }
    return this.createManyEntries(subjectModels);
  }

  async addTeacherToSubject(username, subjectCode) {
    if (!username || typeof username !== 'string' || username.length < 5) {
      throw new Error('Невалидно потребителско име!');
    }

    const subject = await this.getSubjectByCode(subjectCode);
    return this.collection.updateOne(
      {
        code: subject.code,
      },
      {
        $push: {
          teachers: username,
        },
      },
    );
  }

  async addTeacherToSubjects(username, subjectCodes) {
    const updates = [];
    for (const subject of subjectCodes) {
      updates.push(this.addTeacherToSubject(username, subject));
    }
    return Promise.all(updates);
  }

  async getSubjectByCode(code) {
    if (!code) {
      throw new Error('Невалиден код на предмет!');
    }

    return this.collection.findOne({ code });
  }

  async getSubjectsByCodes(codes) {
    if (!codes || !Array.isArray(codes)) {
      throw new Error('Невалидни предмети!');
    }

    const validSubjectCodes = [];
    const subjectPromises = [];

    codes.forEach((code) => {
      const promise = this.getSubjectByCode(code).then((result) => {
        if (result) {
          validSubjectCodes.push(result.code);
        }
      });
      subjectPromises.push(promise);
    });

    await Promise.all(subjectPromises);
    return validSubjectCodes;
  }

  async getSubjectByName(name) {
    if (!name) {
      throw new Error('Невалидно име');
    }

    return this.collection.findOne({ name });
  }

  async getFreeSubjects() {
    const subjects = await this.collection.find({ teachers: { $size: 0 } }).toArray();

    const codes = [];
    subjects.forEach((subject) => {
      codes.push(subject.code);
    });
    return codes;
  }
}

module.exports = SubjectData;
