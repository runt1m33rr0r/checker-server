class Group {
    constructor(groupId, subjectIds) {
        this._groupId = groupId;
        this._subjectIds = subjectIds;
    }

    getGroupId() {
        return this._groupId;
    }

    getSubjectIds() {
        return this._subjectIds;
    }
}

module.exports = Group;