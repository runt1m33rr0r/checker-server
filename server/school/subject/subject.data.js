const BaseData = require('../../base/base.data');

class SubjectData extends BaseData {
  createSubjects(subjectsArray) {
    // input data duplicate check missing
    const subjectModels = [];
    const checks = [];
    const { Subject } = this.models;

    /* eslint no-restricted-syntax: 0 */
    for (const subject of subjectsArray) {
      const subjectCode = subject.code;
      const subjectName = subject.name;
      const { teachers } = subject;

      const check = this.getSubjectByCode(subjectCode).then((result) => {
        if (result) {
          return Promise.reject(new Error('Такива предмети вече съществуват!'));
        }

        subjectModels.push(new Subject(subjectName, subjectCode, teachers));
      });
      checks.push(check);
    }

    return Promise.all(checks).then(() => this.createManyEntries(subjectModels));
  }

  addTeacherToSubject(username, subjectCode) {
    if (!username || typeof username !== 'string' || username.length < 5) {
      return Promise.reject(new Error('Невалидно потребителско име!'));
    }

    return this.getSubjectByCode(subjectCode).then((subject) => {
      this.collection.updateOne(
        {
          code: subject.code,
        },
        {
          $push: {
            teachers: username,
          },
        },
      );
    });
  }

  addTeacherToSubjects(username, subjectCodes) {
    const updates = [];
    for (const subject of subjectCodes) {
      updates.push(this.addTeacherToSubject(username, subject));
    }
    return Promise.all(updates);
  }

  getSubjectByCode(code) {
    if (!code) {
      return Promise.reject(new Error('Невалиден код на предмет!'));
    }

    return this.collection.findOne({ code });
  }

  getSubjectsByCodes(codes) {
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

    return Promise.all(subjectPromises).then(() => Promise.resolve(validSubjectCodes));
  }

  getSubjectByName(name) {
    if (!name) {
      return Promise.reject(new Error('Невалидно име'));
    }

    return this.collection.findOne({ name });
  }

  getFreeSubjects() {
    return this.collection
      .find({ teachers: { $size: 0 } })
      .toArray()
      .then((subjects) => {
        const codes = [];
        subjects.forEach((subject) => {
          codes.push(subject.code);
        });
        return codes;
      });
  }
}

module.exports = SubjectData;
