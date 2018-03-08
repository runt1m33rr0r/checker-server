const BaseData = require('../base/base.data');

class UserData extends BaseData {
  createUser(username, roles, salt, hash) {
    return this.getUserByUsername(username).then((result) => {
      if (result) {
        return Promise.reject(new Error('Потребителското име е заето!'));
      }

      const { User } = this.models;
      const userModel = new User(username, roles, salt, hash);
      return this.createEntry(userModel);
    });
  }

  getUserById(id) {
    return super.getByID(id);
  }

  getUserByUsername(username) {
    if (!username) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.findOne({
      username,
    });
  }

  checkPassword(password, salt, hash, encryption) {
    if (!password || !salt || !hash || !encryption) {
      throw new Error('Невалидни данни!');
    }

    const testHash = encryption.getHash(salt, password);
    const result = testHash === hash;
    return result;
  }

  cleanTeachers() {
    return this.deleteMany({ roles: { $in: ['Teacher'] } });
  }

  cleanStudents() {
    return this.deleteMany({ roles: { $in: ['Student'] } });
  }
}

module.exports = UserData;
