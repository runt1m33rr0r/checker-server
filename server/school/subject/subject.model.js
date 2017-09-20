class Subject {
    constructor(name, code, teachers) {
        if (typeof name !== 'string' ||
            name.length < 3 ||
            name.length > 30) {
            throw new Error('Invalid subject name!');
        }

        if (typeof name !== 'string' ||
            name.length < 3 ||
            name.length > 30) {
            throw new Error('Invalid subject code!');
        }

        if (!teachers || !Array.isArray(teachers)) {
            throw new Error('Invalid teachers collection!');
        }

        this.name = name;
        this.code = code;
        this.teachers = teachers;
    }
}

module.exports = Subject;