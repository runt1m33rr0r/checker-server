class Group {
    constructor(name, subjects) {
        if (typeof name !== 'string' ||
            name.length < 1 ||
            name.length > 5) {
            throw new Error('Невалидни данни!');
        }

        if (!subjects || !Array.isArray(subjects)) {
            throw new Error('Невалидни данни!');
        }

        for (let subject of subjects) {
            if (typeof subject !== 'string' ||
                subject.length < 3) {
                throw new Error('Невалидни данни!');
            }
        }

        this.name = name;
        this.subjects = subjects;
        this.students = [];
        this.leadTeacher = '';
    }
}

module.exports = Group;