class Subject {
    constructor(subjectId, subjectCode, someSubject, teacherIds) {
        this._subjectId = subjectId;
        this._subjectCode = subjectCode;
        this._subject = someSubject;
        this._teacherIds = teacherIds;
    }

    getSubjectId() {
        return this._subjectId;
    }

    getSubjectCode() {
        return this._subjectCode;
    }

    getSubjectName() {
        return this._subject;
    }

    getRandomTeacherId() {
        return this._teacherIds[
            Math.floor(Math.random() * this._teacherIds.length)];
    }
}

module.exports = Subject;