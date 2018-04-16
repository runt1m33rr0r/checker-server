const BaseData = require('../../base/base.data');

class GroupData extends BaseData {
  async createGroup(name, subjects) {
    if (await this.getGroupByName(name)) {
      throw new Error('Вече има такава група!');
    }

    const { Group } = this.models;
    const groupModel = new Group(name, subjects);
    return this.createEntry(groupModel);
  }

  async updateGroupSubjects(groupName, subjects) {
    if (
      !groupName ||
      typeof groupName !== 'string' ||
      groupName.length < 1 ||
      !Array.isArray(subjects)
    ) {
      throw new Error('Невалидна група или предмети!');
    }

    for (const subject of subjects) {
      if (typeof subject !== 'string' || subject.length < 3) {
        throw new Error('Невалиден предмет!');
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

  async createGroups(groupsArray) {
    const groupModels = [];
    const checks = [];
    const { Group } = this.models;

    for (const group of groupsArray) {
      const groupName = group.name;
      const { subjects } = group;

      groupModels.push(new Group(groupName, subjects));
      checks.push(this.getGroupByName(groupName));
    }

    const res = await Promise.all(checks);
    if (res.length > 0) {
      throw new Error('Вече има такава група!');
    }
    return this.createManyEntries(groupModels);
  }

  async getGroupByName(name) {
    if (!name) {
      throw new Error('Невалидно име!');
    }

    return this.collection.findOne({ name });
  }
}

module.exports = GroupData;
