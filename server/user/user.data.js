const BaseData = require('../base/base.data');

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

  async cleanTeachers() {
    return this.deleteMany({ roles: { $in: ['Teacher'] } });
  }

  async cleanStudents() {
    return this.deleteMany({ roles: { $in: ['Student'] } });
  }
}

module.exports = UserData;
