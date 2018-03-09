const BaseData = require('../../base/base.data');

class GroupData extends BaseData {
  createGroup(name, subjects) {
    return this.getGroupByName(name).then((result) => {
      if (result) {
        return Promise.reject(new Error('Няма такава група!'));
      }

      const { Group } = this.models;
      const groupModel = new Group(name, subjects);
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
      return Promise.reject(new Error('Невалидна група или предмети!'));
    }

    /* eslint no-restricted-syntax: 0 */
    for (const subject of subjects) {
      if (typeof subject !== 'string' || subject.length < 3) {
        return Promise.reject(new Error('Невалиден предмет!'));
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
    const { Group } = this.models;

    for (const group of groupsArray) {
      const groupName = group.name;
      const { subjects } = group;

      const check = this.getGroupByName(groupName).then((result) => {
        if (result) {
          return Promise.reject(new Error('Няма такава група!'));
        }

        groupModels.push(new Group(groupName, subjects));
      });
      checks.push(check);
    }

    return Promise.all(checks).then(() => this.createManyEntries(groupModels));
  }

  getGroupByName(name) {
    if (!name) {
      return Promise.reject(new Error('Невалидно име!'));
    }

    return this.collection.findOne({ name });
  }
}

module.exports = GroupData;
