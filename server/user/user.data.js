const BaseData = require('../base/base.data');

class UserData extends BaseData {
  async createUser(username, roles, salt, hash) {
    if (await this.getUserByUsername(username)) {
      return Promise.reject(new Error('Потребителското име е заето!'));
    }
    const { User } = this.models;
    const userModel = new User(username, roles, salt, hash);
    return this.createEntry(userModel);
  }

  async getUserById(id) {
    return super.getByID(id);
  }

  async getUserByUsername(username) {
    if (!username) {
      return Promise.reject(new Error('Невалидно потребителско име!'));
    }

    return this.collection.findOne({ username });
  }

  async checkPassword(password, salt, hash, encryption) {
    if (!password || !salt || !hash || !encryption) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    const testHash = encryption.getHash(salt, password);
    const result = testHash === hash;
    return Promise.resolve(result);
  }

  async cleanTeachers() {
    return this.deleteMany({ roles: { $in: ['Teacher'] } });
  }

  async cleanStudents() {
    return this.deleteMany({ roles: { $in: ['Student'] } });
  }
}

module.exports = UserData;
