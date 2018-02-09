const BaseData = require('../../base/base.data');

class GroupData extends BaseData {
  constructor(db, models) {
    super(db);

    const { Group } = models;
    this.Group = Group;
  }

  createGroup(name, subjects) {
    return this.getGroupByName(name).then((result) => {
      if (result) {
        return Promise.reject(new Error('Невалидни данни!'));
      }

      const groupModel = new this.Group(name, subjects);
      return this.createEntry(groupModel);
    });
  }

  updateGroupSubjects(groupName, subjects) {
    if (
      !groupName ||
      typeof groupName !== 'string' ||
      groupName.length < 1 ||
      !Array.isArray(subjects)
    ) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    /* eslint no-restricted-syntax: 0 */
    for (const subject of subjects) {
      if (typeof subject !== 'string' || subject.length < 3) {
        return Promise.reject(new Error('Невалидни данни!'));
      }
    }

    return this.collection.findOneAndUpdate(
      {
        name: groupName,
      },
      {
        $set: {
          subjects,
        },
      },
    );
  }

  createGroups(groupsArray) {
    const groupModels = [];
    const checks = [];

    for (const group of groupsArray) {
      const groupName = group.name;
      const { subjects } = group;

      const check = this.getGroupByName(groupName).then((result) => {
        if (result) {
          return Promise.reject(new Error('Невалидни данни!'));
        }

        groupModels.push(new this.Group(groupName, subjects));
      });
      checks.push(check);
    }

    return Promise.all(checks).then(() => this.createManyEntries(groupModels));
  }

  getGroupByName(name) {
    if (!name) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.findOne({ name });
  }
}

module.exports = GroupData;
