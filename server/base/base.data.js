const { ObjectID } = require('mongodb');

class BaseData {
  constructor(db, models, collection) {
    this.db = db;
    this.models = models;
    this.collection = collection;
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

  deleteOne(criteria) {
    return this.collection.remove(criteria, { justOne: true });
  }

  deleteMany(criteria) {
    return this.collection.remove(criteria, { justOne: false });
  }

  getByID(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject(new Error('Невалидно id!'));
    }

    return this.collection.findOne({
      _id: new ObjectID(id),
    });
  }

  getCount() {
    return this.collection.count();
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
