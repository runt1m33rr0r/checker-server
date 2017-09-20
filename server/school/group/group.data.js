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
                        message: 'Такава група вече съществува!',
                    });
                }

                const groupModel = new this.Group(name, subjects);
                return this.createEntry(groupModel);
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
                            message: 'Такива групи вече съществуват!',
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
                message: 'Name not specified!',
            });
        }

        return this.collection.findOne({
            name: name,
        });
    }
}

module.exports = GroupData;