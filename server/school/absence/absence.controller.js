const init = ({ data: { AbsenceData } }) => ({
  async getAbsencesForTeacher(req, res) {
    try {
      const { username } = req;
      const absences = await AbsenceData.getAbsencesByTeacher(username);
      return res.json({
        success: true,
        message: 'Успешно получени данни.',
        absences,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
  async getAbsencesForStudent(req, res) {
    try {
      const { username } = req;
      const absences = await AbsenceData.getAbsencesByStudent(username);
      return res.json({
        success: true,
        message: 'Успешно получени данни.',
        absences,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  },
});

module.exports = { init };
