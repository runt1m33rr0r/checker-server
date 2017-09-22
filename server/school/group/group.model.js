class Group {
    constructor(name, subjects) {
        if (typeof name !== 'string' ||
            name.length < 1 ||
            name.length > 5) {
            throw new Error('Invalid group name!');
        }

        if (!subjects || !Array.isArray(subjects)) {
            throw new Error('Invalid subjects collection!');
        }

        for (let subject of subjects) {
            if (typeof subject !== 'string' ||
                subject.length < 3) {
                throw new Error('Invalid subjects collection!');
            }
        }

        this.name = name;
        this.subjects = subjects;
    }
}

module.exports = Group;