const Timetable = require('./objects/timetable');
const GeneticAlgorithm = require('./genetics/genetic.algorithm');

class TimetableGenerator {
    constructor(timeslots, teachers, subjects, groups) {
        this._timeslots = timeslots;
        this._teachers = teachers;
        this._subjects = subjects;
        this._groups = groups;
    }

    getReadyTimetable() {
        const timetable = this._initTimetable();
        const ga = new GeneticAlgorithm(100, 0.01, 0.9, 2, 5);
        let population = ga.initPopulation(timetable);

        ga.evalPopulation(population, timetable);

        let generation = 1;
        while (ga.isTerminationConditionMet(generation, 1000) === false &&
            ga.isTerminationConditionMet(population) === false) {
            population = ga.crossoverPopulation(population);
            population = ga.mutatePopulation(population, timetable);
            ga.evalPopulation(population, timetable);
            generation++;
        }

        timetable.createLessons(population.getFittest(0));

        return timetable;
    }

    _initTimetable() {
        const timetable = new Timetable();

        this._initTimeslots(timetable);
        this._initTeachers(timetable);
        this._initSubjects(timetable);
        this._initGroups(timetable);

        return timetable;
    }

    _initTimeslots(timetable) {
        for (let i = 0; i < this._timeslots.length; i++) {
            const currentTimeslot = this._timeslots[i];
            timetable.addTimeslot(i + 1, currentTimeslot.value);
        }
    }

    _initTeachers(timetable) {
        for (let i = 0; i < this._teachers.length; i++) {
            const currentTeacher = this._teachers[i];
            const username = currentTeacher.username;
            const id = i + 1;

            timetable.addTeacher(id, username);
            currentTeacher.id = id;
        }
    }

    _initSubjects(timetable) {
        for (let i = 0; i < this._subjects.length; i++) {
            const currentSubject = this._subjects[i];
            const subjectTeachers = currentSubject.teachers;
            const id = i + 1;
            const teacherIds = [];

            this._teachers.forEach((teacher) => {
                if (subjectTeachers.includes(teacher.username)) {
                    teacherIds.push(teacher.id);
                }
            });

            timetable.addSubject(
                id,
                currentSubject.code,
                currentSubject.name,
                teacherIds);
            currentSubject.id = id;
        }
    }

    _initGroups(timetable) {
        for (let i = 0; i < this._groups.length; i++) {
            const currentGroup = this._groups[0];
            const groupSubjects = currentGroup.subjects;
            const id = i + 1;
            const subjectdIds = [];

            this._subjects.forEach((subject) => {
                if (groupSubjects.includes(subject)) {
                    subjectdIds.push(subject.id);
                }
            });

            timetable.addGroup(id, subjectdIds);
        }
    }
}

module.exports = TimetableGenerator;