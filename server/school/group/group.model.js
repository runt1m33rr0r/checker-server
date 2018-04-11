const { validateString, validateStrArray } = require('../../utils/validators');
const constants = require('../../utils/constants');
const BaseModel = require('../../base/base.model');

class Group extends BaseModel {
  constructor(name, subjects) {
    super();

    validateString({
      input: name,
      errorMessage: 'Невалидно име на група!',
      minLen: constants.MIN_GROUP_LEN,
      maxLen: constants.MAX_GROUP_LEN,
    });

    validateStrArray({
      input: subjects,
      errorMessage: 'Не може да има група без предмети!',
      minLen: constants.MIN_SUBJECT_LEN,
      maxLen: constants.MAX_SUBJECT_LEN,
    });

    this.name = name;
    this.subjects = subjects;
    this.students = [];
    this.leadTeacher = '';
  }
}

module.exports = Group;
