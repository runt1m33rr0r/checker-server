class Teacher {
    constructor(firstName, lastName, username, isLead, group, subjects) {
        if (typeof firstName !== 'string' ||
            firstName.length < 3) {
            throw new Error('Invalid first name!');
        }

        if (typeof lastName !== 'string' ||
            lastName.length < 3) {
                throw new Error('Invalid last name!');
        }

        if (typeof username !== 'string' ||
            username.length < 6) {
                throw new Error('Invalid username!');
        }

        if (typeof isLead !== 'boolean') {
            throw new Error('Invalid teacher status!');
        }

        if (typeof group !== 'string' ||
            (isLead === true && group.length < 2)) {
            throw new Error('Invalid group!');
        }

        if (!Array.isArray(subjects)) {
            throw new Error('Invalid subjects!');
        }

        for (let subject of subjects) {
            if (typeof subject !== 'string' || subject.length < 3) {
                throw new Error('Invalid subjects!');
            }
        }

        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.isLead = isLead;
        this.group = group;
        this.subjects = subjects;
    }
}

module.exports = Teacher;