const { ObjectID } = require('mongodb');

class BaseData {
    constructor(db) {
        this.db = db;
        this.collectionName = this.constructor.name + 'Collection';
        this.collection = this.db.collection(this.collectionName);
    }

    createEntry(entry) {
        if (!entry) {
            return Promise.reject({ message: 'Invalid entry!' });
        }

        return this.collection.insertOne(entry);
    }

    getByID(id) {
        if (!id || !ObjectID.isValid(id)) {
            return Promise.reject({ message: 'Invalid ID' });
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