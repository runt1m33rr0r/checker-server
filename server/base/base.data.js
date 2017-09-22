const {
    ObjectID,
} = require('mongodb');

class BaseData {
    constructor(db) {
        this.db = db;
        this.collectionName = this.constructor.name + 'Collection';
        this.collection = this.db.collection(this.collectionName);
    }

    clean() {
        return this.collection.deleteMany({});
    }

    createEntry(entry) {
        if (!entry) {
            return Promise.reject({
                message: 'Invalid entry!',
            });
        }

        return this.collection.insertOne(entry);
    }

    createManyEntries(entries) {
        if (!entries || !Array.isArray(entries) || entries.length < 1) {
            return Promise.reject({
                message: 'Invalid entries!',
            });
        }

        return this.collection.insertMany(entries);
    }

    getByID(id) {
        if (!id || !ObjectID.isValid(id)) {
            return Promise.reject({
                message: 'Invalid ID',
            });
        }

        return this.collection.findOne({
            _id: new ObjectID(id),
        });
    }

    getAll() {
        return this.collection.find().toArray();
    }
}

module.exports = BaseData;