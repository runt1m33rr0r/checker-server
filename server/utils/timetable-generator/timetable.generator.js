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

        const lessons = timetable.getLessons();
        let finalLessons = [];
        for (let i = 0; i < lessons.length; i++) {
            const bestLesson = lessons[i];
            const subject = timetable
                .getSubjectById(bestLesson.getSubjectId())
                .getSubjectCode();
            const group = timetable
                .getGroupById(bestLesson.getGroupId())
                .getGroupName();
            const teacher = timetable
                .getTeacherById(bestLesson.getTeacherId())
                .getTeacherName();
            const t = timetable
                .getTimeslotById(bestLesson.getTimeslotId())
                .getTimeslot();
            // const value =
            //     `From ${t.fromHour}:${t.fromMinute}` +
            //     ` to ${t.toHour}:${t.toMinute} on ${t.day}`;

            const lesson = {
                subject: subject,
                group: group,
                teacher: teacher,
                timeslot: t,
            };

            finalLessons.push(lesson);
        }

        const clashes = timetable.calcClashes();

        return {
            lessons: finalLessons,
            clashes: clashes,
        };
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
            const t = this._timeslots[i];
            timetable.addTimeslot(i + 1, t);
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
            const currentGroup = this._groups[i];
            const groupSubjects = currentGroup.subjects;
            const id = i + 1;
            const subjectdIds = [];

            this._subjects.forEach((subject) => {
                if (groupSubjects.includes(subject.code)) {
                    subjectdIds.push(subject.id);
                }
            });

            timetable.addGroup(currentGroup.name, id, subjectdIds);
        }
    }
}

module.exports = TimetableGenerator;