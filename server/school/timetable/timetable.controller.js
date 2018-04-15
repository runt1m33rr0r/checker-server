const Generator = require('../../utils/timetable.generator');

const init = ({
  data: {
    GroupData,
    SubjectData,
    TimeslotData,
    TeacherData,
    LessonData,
    SettingsData,
    StudentData,
    UserData,
  },
}) => ({
  async createLesson(req, res) {
    try {
      const {
        groupName, subjectCode, teacherUsername, timeslotID,
      } = req.body;

      const group = await GroupData.getGroupByName(groupName);
      const subject = await SubjectData.getSubjectByCode(subjectCode);
      const teacher = await TeacherData.getTeacherByUsername(teacherUsername);
      const timeslot = await TimeslotData.getByID(timeslotID);

      if (!group || !subject || !teacher || !timeslot) {
        return res.json({ success: false, message: 'Невалидни данни за урок!' });
      }

      await LessonData.createLesson(groupName, subjectCode, teacherUsername, timeslot);
      return res.json({ success: true, message: 'Урока беше успешно добавен!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async deleteLesson(req, res) {
    try {
      await LessonData.deleteLesson(req.body.lesson);
      return res.json({ success: true, message: 'Урока беше успешно премахнат!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getAllGroupNames(req, res) {
    try {
      if (req.query.count === 'true') {
        const count = await GroupData.getCount();
        return res.json({ success: true, count, message: 'Данни получени успешно!' });
      }

      const groupNames = await GroupData.getAllPropVals('name');
      return res.json({ success: true, groupNames, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getAllSubjectCodes(req, res) {
    try {
      if (req.query.count === 'true') {
        const count = await SubjectData.getCount();
        return res.json({ success: true, count, message: 'Данни получени успешно!' });
      }

      if (req.query.free === 'true') {
        const subjectCodes = await SubjectData.getFreeSubjects();
        return res.json({ success: true, subjectCodes, message: 'Свободни предмети получени!' });
      }

      const subjectCodes = await SubjectData.getAllPropVals('code');
      return res.json({ success: true, subjectCodes, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getAllTimeslots(req, res) {
    try {
      const timeslots = await TimeslotData.getAll();
      return res.json({ success: true, timeslots, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getAllTeacherUsernames(req, res) {
    try {
      if (req.query.count === 'true') {
        const count = await TeacherData.getCount();
        return res.json({ success: true, count, message: 'Данни получени успешно!' });
      }

      const usernames = await TeacherData.getAllPropVals('username');
      return res.json({ success: true, usernames, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getAllStudents(req, res) {
    try {
      if (req.query.count === 'true') {
        const count = await StudentData.getCount();
        return res.json({ success: true, count, message: 'Данни получени успешно!' });
      }

      return res.json({ success: true, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getNumberOfStudents(req, res) {
    try {
      const count = await StudentData.getCount();
      return res.json({ success: true, count, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getGroupTimetable(req, res) {
    try {
      const { name } = req.params;
      const lessons = await LessonData.getLessonsByGroupName(name);
      return res.json({ success: true, lessons, message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getLessons(req, res) {
    try {
      if (req.query.mine === 'true' && req.roles.includes('Teacher')) {
        const lessons = await LessonData.getLessonsByTeacher(req.username);
        return res.json({ success: true, lessons, message: 'Данни получени успешно!' });
      }

      if (req.query.mine === 'true' && req.roles.includes('Student')) {
        const student = await StudentData.getStudentByUsername(req.username);
        const lessons = await LessonData.getLessonsByGroupName(student.group);
        return res.json({ success: true, lessons, message: 'Данни получени успешно!' });
      }

      if (req.query.group) {
        const lessons = await LessonData.getLessonsByGroupName(req.query.group);
        return res.json({ success: true, lessons, message: 'Данни получени успешно!' });
      }

      return res.json({ success: true, lessons: [], message: 'Данни получени успешно!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async saveBaseSettings(req, res) {
    try {
      const { groups, timeslots, subjects } = req.body;

      await GroupData.clean();
      await TeacherData.clean();
      await StudentData.clean();
      await UserData.cleanTeachers();
      await UserData.cleanStudents();
      await GroupData.clean();
      await LessonData.clean();
      await TimeslotData.clean();
      await SubjectData.clean();
      await SubjectData.createSubjects(subjects);
      await TimeslotData.createTimeslots(timeslots);
      await GroupData.createGroups(groups);
      await SettingsData.updateSettings({ setupFinished: true });

      return res.json({ success: true, message: 'Настройките бяха успешно запазени!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async generateTimetable(req, res) {
    try {
      const timeslots = await TimeslotData.getAll();
      const teachers = await TeacherData.getAll();
      const subjects = await SubjectData.getAll();
      const groups = await GroupData.getAll();

      const lessons = [];

      subjects.forEach((subject) => {
        if (subject.teachers.length < 1) {
          return res.json({
            success: false,
            message: 'Не може да има предмети без преподаватели!',
          });
        }
      });

      if (timeslots.length < 1 || teachers.length < 1 || subjects.length < 1 || groups.length < 1) {
        return res.json({
          success: false,
          message: 'Липсват данни(часови диапазони/учители/предмети/групи)!',
        });
      }

      const generator = new Generator(timeslots, teachers, subjects, groups);
      const { timetableLessons } = generator.getReadyTimetable();

      if (!Array.isArray(timetableLessons) || timetableLessons.length < 1) {
        return res.json({ success: false, message: 'Невалидна програма!' });
      }

      await LessonData.clean();
      await LessonData.createLessons(lessons);

      return res.json({
        success: true,
        message: 'Успешно генерирана програма!',
        lessons: timetableLessons,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
});

module.exports = { init };
