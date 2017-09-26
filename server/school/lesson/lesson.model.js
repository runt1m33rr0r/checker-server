class Lesson {
    constructor(groupName, subjectCode, teacherUsername, timeslot) {
        if (typeof groupName !== 'string' || groupName.length < 2) {
            throw new Error('Невалидни данни!');
        }

        if (typeof subjectCode !== 'string' || subjectCode.length < 3) {
            throw new Error('Невалидни данни!');
        }

        if (typeof teacherUsername !== 'string' || teacherUsername.length < 6) {
            throw new Error('Невалидни данни!');
        }

        if (typeof timeslot.fromHour !== 'number' ||
            typeof timeslot.fromMinute !== 'number' ||
            typeof timeslot.toHour !== 'number' ||
            typeof timeslot.toMinute !== 'number' ||
            typeof timeslot.day !== 'number' ||
            timeslot.fromHour < 0 || timeslot.fromHour > 24 ||
            timeslot.fromMinute < 0 || timeslot.fromMinute > 60 ||
            timeslot.toHour < 0 || timeslot.toHour > 24 ||
            timeslot.toMinute < 0 || timeslot.toMinute > 60 ||
            timeslot.day < 1 || timeslot.day > 7) {
            throw new Error('Невалидни данни!');
        }

        this.groupName = groupName;
        this.subjectCode = subjectCode;
        this.teacherUsername = teacherUsername;
        this.timeslot = timeslot;
    }
}

module.exports = Lesson;