class Group {
  constructor(groupName, groupId, subjectIds) {
    this._groupName = groupName;
    this._groupId = groupId;
    this._subjectIds = subjectIds;
  }

  getGroupId() {
    return this._groupId;
  }

  getSubjectIds() {
    return this._subjectIds;
  }

  getGroupName() {
    return this._groupName;
  }
}

module.exports = Group;
