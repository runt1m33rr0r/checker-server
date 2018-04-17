const init = ({ data: { StudentData, LessonData } }) => {
  const verifyIdentity = async (req) => {
    if (
      !req.files ||
      !Array.isArray(req.files.photo) ||
      req.files.photo.length < 1 ||
      !req.files.photo[0].buffer ||
      !req.user.username
    ) {
      throw new Error('Невалидни данни!');
    }

    const photo = req.files.photo[0].buffer;
    const { username } = req.user;

    const studData = await StudentData.verifyIdentity(username, photo);
    if (studData.same !== 'True') {
      throw new Error('Лицето на снимката не е ваше!');
    }
  };

  return {
    async getTimetable(req, res) {
      try {
        const { username } = req.user;
        const student = await StudentData.getStudentByUsername(username);
        const lessons = await LessonData.getLessonsByGroupName(student.group);
        return res.json({ success: true, message: 'Успешно получени данни.', lessons });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
    async getAbsences(req, res) {
      try {
        const { username } = req.user;
        const student = await StudentData.getStudentByUsername(username);
        return res.json({
          success: true,
          message: 'Успешно получени данни.',
          absences: student.absences,
        });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
    async createEncoding(req, res) {
      try {
        const photo = req.body.image;
        if (typeof photo !== 'string' || photo < 1) {
          return res.json({ success: false, message: 'Невалидно изображение!' });
        }
        const { username } = req;

        const encoding = await StudentData.createEncoding(photo);
        await StudentData.saveEncoding(username, encoding);

        return res.json({ success: true, message: 'Запазено успешно!' });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
    async check(req, res) {
      try {
        const { username } = req.user;

        await verifyIdentity(req);
        const student = await StudentData.getStudentByUsername(username);

        if (!student) {
          return res.json({ success: false, message: 'Вътрешна грешка!' });
        }

        const date = new Date();
        await StudentData.addCheck(
          student.username,
          date.getDay(),
          date.getHours(),
          date.getMinutes(),
        );

        return res.json({ success: true, message: 'Успешно отбелязано присъствие!' });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
  };
};

module.exports = { init };
