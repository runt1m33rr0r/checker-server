const init = ({ data: { StudentData, LessonData } }) => ({
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
      const photo = req.body.image;

      await StudentData.verifyIdentity(username, photo);

      const date = new Date();
      await StudentData.addCheck(username, date.getDay(), date.getHours(), date.getMinutes());

      return res.json({ success: true, message: 'Успешно отбелязано присъствие!' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
});

module.exports = { init };
