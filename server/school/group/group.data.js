const BaseData = require('../../base/base.data');

class GroupData extends BaseData {
    constructor(db, models) {
        super(db);

        const {
            Group,
        } = models;
        this.Group = Group;
    }

    createGroup(name, subjects) {
        return this.getGroupByName(name)
            .then((result) => {
                if (result) {
                    return Promise.reject({
                        message: 'Невалидни данни!',
                    });
                }

                const groupModel = new this.Group(name, subjects);
                return this.createEntry(groupModel);
            });
    }

    updateGroupSubjects(groupName, subjects) {
        if (!groupName ||
            typeof groupName !== 'string' ||
            groupName.length < 1 ||
            !Array.isArray(subjects)) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        for (let subject of subjects) {
            if (typeof subject !== 'string' ||
                subject.length < 3) {
                return Promise.reject({
                    message: 'Невалидни данни!',
                });
            }
        }

        return this.collection.findOneAndUpdate({
            name: groupName,
        }, {
            $set: {
                subjects: subjects,
            },
        });
    }

    createGroups(groupsArray) {
        let groupModels = [];
        let checks = [];

        for (let group of groupsArray) {
            const groupName = group.name;
            const subjects = group.subjects;

            const check = this.getGroupByName(groupName)
                .then((result) => {
                    if (result) {
                        return Promise.reject({
                            message: 'Невалидни данни!',
                        });
                    }

                    groupModels.push(new this.Group(groupName, subjects));
                });
            checks.push(check);
        }

        return Promise.all(checks)
            .then(() => {
                return this.createManyEntries(groupModels);
            });
    }

    getGroupByName(name) {
        if (!name) {
            return Promise.reject({
                message: 'Невалидни данни!',
            });
        }

        return this.collection.findOne({
            name: name,
        });
    }
}

module.exports = GroupData;