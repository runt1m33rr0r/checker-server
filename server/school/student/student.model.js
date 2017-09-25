class Student {
    constructor(firstName, lastName, username, group) {
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

        if (typeof group !== 'string' || group.length < 2) {
            throw new Error('Invalid group!');
        }

        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.group = group;
        this.encoding = '';
        this.marks = [];
        this.checks = [];
        this.absences = [];
    }
}

module.exports = Student;