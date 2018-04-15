const roleTypes = require('../utils/roletypes');
const settings = require('../config/settings');

const TOKEN_EXPIRATION = '7d';

const init = ({
  data: {
    UserData, GroupData, SubjectData, TeacherData, StudentData,
  },
  encryption,
}) => {
  const seedAdmin = async () => {
    try {
      const user = await UserData.getUserByUsername('admin');
      if (!user) {
        const salt = encryption.getSalt();
        const hash = encryption.getHash(salt, '123456');
        const roles = [roleTypes.Normal, roleTypes.Teacher, roleTypes.Admin];

        await UserData.createUser('admin', roles, salt, hash);
      }
    } catch (error) {
      /* eslint no-console: 0 */
      console.log(error);
    }
  };

  seedAdmin();

  const registerTeacher = async (firstName, lastName, username, isLead, groupName, subjects) => {
    if (isLead) {
      const group = await GroupData.getGroupByName(groupName);
      if (group) {
        const subjectCodes = await SubjectData.getSubjectsByCodes(subjects);
        const teacher = await TeacherData.createTeacher(
          firstName,
          lastName,
          username,
          true,
          group,
          subjectCodes,
        );

        await SubjectData.addTeacherToSubjects(username, teacher.subjects);
      }

      return Promise.reject(new Error('Невалидна група!'));
    }

    const subjectCodes = await SubjectData.getSubjectsByCodes(subjects);
    const teacher = await TeacherData.createTeacher(
      firstName,
      lastName,
      username,
      false,
      '',
      subjectCodes,
    );
    return SubjectData.addTeacherToSubjects(username, teacher.subjects);
  };

  const registerStudent = async (firstName, lastName, username, groupName) => {
    const group = await GroupData.getGroupByName(groupName);
    if (group) {
      return StudentData.createStudent(firstName, lastName, username, group);
    }

    return Promise.reject(new Error('Невалидна група!'));
  };

  return {
    async getProfile(req, res) {
      try {
        if (req.roles.includes('Student')) {
          const profile = await StudentData.getStudentByUsername(req.username);
          return res.json({ success: true, message: 'Данни изпратени успешно!', profile });
        }

        if (req.roles.includes('Teacher')) {
          const profile = await TeacherData.getTeacherByUsername(req.username);
          return res.json({
            success: true,
            message: 'Данни изпратени успешно!',
            profile: profile || {},
          });
        }
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
    async saveProfile(req, res) {
      try {
        const { roles } = req.user;

        if (roles.includes('Student')) {
          if (
            !req.files ||
            !Array.isArray(req.files.photo) ||
            req.files.photo.length < 1 ||
            !req.files.photo[0] ||
            !req.files.photo[0].buffer
          ) {
            return res.json({ success: false, message: 'Невалидни данни!' });
          }

          const photo = req.files.photo[0].buffer;
          const { username } = req.user;

          const encoding = await StudentData.createEncoding(photo);
          await StudentData.saveEncoding(username, encoding);
          return res.json({ success: true, message: 'Настойките бяха успешно запазени!' });
        }

        // add other stuff later
        return res.redirect('/');
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
    async registerUser(req, res) {
      try {
        const {
          username,
          password,
          firstName,
          lastName,
          leadTeacher,
          group,
          subjects,
          userType,
        } = req.body;

        const salt = encryption.getSalt();
        const hash = encryption.getHash(salt, password);
        const roles = [roleTypes.Normal];

        const token = encryption.getToken(
          {
            roles,
            username,
          },
          settings.secret,
          TOKEN_EXPIRATION,
        );

        if (userType === roleTypes.Student) {
          roles.push(roleTypes.Student);

          await registerStudent(firstName, lastName, username, group);
          await UserData.createUser(username, roles, salt, hash);

          return res.json({
            success: true,
            message: 'Успешна регистрация!',
            roles,
            token,
          });
        }

        if (userType === roleTypes.Teacher) {
          if (typeof leadTeacher !== 'boolean') {
            return res.json({ success: false, message: 'Невалидни потребителски данни!' });
          }

          roles.push(roleTypes.Teacher);

          await registerTeacher({
            firstName,
            lastName,
            username,
            leadTeacher,
            group,
            subjects,
          });
          await UserData.createUser(username, roles, salt, hash);

          return res.json({
            success: true,
            message: 'Успешна регистрация!',
            roles,
            username,
            token,
          });
        }

        return res.json({ success: false, message: 'Невалидни данни!' });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
    async loginUser(req, res) {
      try {
        const { username, password } = req.body;
        const user = await UserData.getUserByUsername(username);
        if (!user) {
          return res.json({ success: false, message: 'Невалиден потребител!' });
        }

        if (!await UserData.checkPassword(password, user.salt, user.hashedPass, encryption)) {
          return res.json({ success: false, message: 'Невалиден потребител!' });
        }

        const token = encryption.getToken(
          {
            roles: user.roles,
            username,
          },
          settings.secret,
          TOKEN_EXPIRATION,
        );
        return res.send({
          success: true,
          message: 'Успешен вход!',
          roles: user.roles,
          username,
          token,
        });
      } catch (error) {
        return res.json({ success: false, message: 'Невалидни данни' });
      }
    },
  };
};

module.exports = { init };
