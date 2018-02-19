const { ObjectID } = require('mongodb');

class BaseData {
  constructor(db) {
    this.db = db;
    this.collectionName = `${this.constructor.name}Collection`;
    this.collection = this.db.collection(this.collectionName);
  }

  clean() {
    return this.collection.deleteMany({});
  }

  createEntry(entry) {
    if (!entry) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.insertOne(entry).then(() => entry);
  }

  createManyEntries(entries) {
    if (!Array.isArray(entries) || entries.length < 1) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.insertMany(entries).then(() => entries);
  }

  getByID(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.findOne({
      _id: new ObjectID(id),
    });
  }

  getAll() {
    return this.collection.find().toArray();
  }

  getFirst() {
    return this.collection.findOne({});
  }

  getAllPropVals(propName) {
    return this.getAll().then((items) => {
      const vals = [];
      items.forEach((item) => {
        vals.push(item[propName]);
      });
      return Promise.resolve(vals);
    });
  }
}

module.exports = BaseData;
