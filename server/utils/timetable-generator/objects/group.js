class Group {
    constructor(groupId, groupSize, subjectIds) {
        this._groupId = groupId;
        this._groupSize = groupSize;
        this._subjectIds = subjectIds;
    }

    getGroupId() {
        return this._groupId;
    }

    getGroupSize() {
        return this._groupSize;
    }

    getSubjectIds() {
        return this._subjectIds;
    }
}

module.exports = Group;