const BaseData = require('../base/base.data');
const { validateString } = require('../utils/validators');

class UserData extends BaseData {
  async createUser(username, roles, salt, hash) {
    if (await this.getUserByUsername(username)) {
      throw new Error('Потребителското име е заето!');
    }
    const { User } = this.models;
    return this.createEntry(new User(username, roles, salt, hash));
  }

  async getUserById(id) {
    return super.getByID(id);
  }

  async getUserByUsername(username) {
    if (!username) {
      throw new Error('Невалидно потребителско име!');
    }

    return this.collection.findOne({ username });
  }

  async checkPassword(password, salt, hash, encryption) {
    if (!password || !salt || !hash || !encryption) {
      throw new Error('Невалидни данни!');
    }

    const testHash = encryption.getHash(salt, password);
    const result = testHash === hash;
    return result;
  }

  async changePassword(username, salt, hashedPass) {
    const errorMessage = 'Невалидни данни!';
    validateString({ input: username, errorMessage });
    validateString({ input: salt, errorMessage });
    validateString({ input: hashedPass, errorMessage });

    return this.collection.updateOne({ username }, { $set: { hashedPass, salt } });
  }

  async cleanTeachers() {
    return this.deleteMany({ roles: { $in: ['Teacher'], $nin: ['Admin'] } });
  }

  async cleanStudents() {
    return this.deleteMany({ roles: { $in: ['Student'], $nin: ['Admin'] } });
  }
}

module.exports = UserData;
