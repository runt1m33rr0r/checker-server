const BaseData = require('../base/base.data');

class UserData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            User,
        } = models;
        this.User = User;
    }

    createUser(username, roles, salt, hash) {
        return this.getUserByUsername(username)
            .then((result) => {
                if (result) {
                    return Promise.reject({
                        message: 'Потребителското име е заето!',
                    });
                }

                const userModel = new this.User(username, roles, salt, hash);
                return this.createEntry(userModel);
            });
    }

    getUserById(id) {
        return super.getByID(id);
    }

    getUserByUsername(username) {
        if (!username) {
            return Promise.reject({
                message: 'Username not specified!',
            });
        }

        return this.collection.findOne({
            username: username,
        });
    }

    checkPassword(password, salt, hash, encryption) {
        if (!password || !salt || !hash || !encryption) {
            throw new Error('Internal server password error!');
        }

        const testHash = encryption.getHash(salt, password);
        const result = testHash === hash;
        return result;
    }
}

module.exports = UserData;