const roleTypes = require('../utils/roletypes');
const settings = require('../config/settings');
const { validateStrArray, validateString } = require('../utils/validators');

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
        const hash = encryption.getHash(salt, 'adminpass987');
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
          group.name,
          subjectCodes,
        );

        return SubjectData.addTeacherToSubjects(username, teacher.subjects);
      } else {
        throw new Error('Няма такава група група!');
      }
    } else {
      const subjectCodes = await SubjectData.getSubjectsByCodes(subjects);
      if (subjectCodes.length > 0) {
        const teacher = await TeacherData.createTeacher(
          firstName,
          lastName,
          username,
          false,
          '',
          subjectCodes,
        );
        return SubjectData.addTeacherToSubjects(username, teacher.subjects);
      } else {
        throw new Error('Невалидни предмети!');
      }
    }
  };

  const registerStudent = async (firstName, lastName, username, groupNames) => {
    const groups = await GroupData.getGroupsByNames(groupNames);
    if (groups.length > 0) {
      const promises = [StudentData.createStudent(firstName, lastName, username, groups)];
      for (const group of groups) {
        promises.push(GroupData.addStudentToGroup(group, username, firstName, lastName));
      }
      return Promise.all(promises);
    } else {
      throw new Error('Невалидни групи!');
    }
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
    async registerUser(req, res) {
      try {
        const {
          username,
          password,
          firstName,
          lastName,
          leadTeacher,
          groups,
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

          await registerStudent(firstName, lastName, username, groups);
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

          await registerTeacher(firstName, lastName, username, leadTeacher, group, subjects);
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

        if (!(await UserData.checkPassword(password, user.salt, user.hashedPass, encryption))) {
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
        return res.json({ success: false, message: error.message });
      }
    },
    async changePassword(req, res) {
      try {
        const { password } = req.body;
        validateString({
          input: password,
          minLen: 6,
          maxLen: 30,
          errorMessage: 'Невалидна парола!',
        });

        const { username, roles } = req;
        const userError = 'Невалидни потребителски данни!';
        validateString({ input: username, errorMessage: userError });
        validateStrArray({
          input: roles,
          errorMessage: userError,
          acceptableValues: Object.values(roleTypes),
        });

        const salt = encryption.getSalt();
        const hash = encryption.getHash(salt, password);
        const token = encryption.getToken(
          {
            roles,
            username,
          },
          settings.secret,
          TOKEN_EXPIRATION,
        );

        await UserData.changePassword(username, salt, hash);
        return res.json({ success: false, token, message: 'Парола успешно променена!' });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    },
  };
};

module.exports = { init };
