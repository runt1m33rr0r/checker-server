const roleTypes = require('../utils/roletypes');
const settings = require('../config/settings');

const TOKEN_EXPIRATION = '7d';

function init({ data, encryption }) {
  const {
    UserData, TeacherData, GroupData, SubjectData, StudentData,
  } = data;

  const seedAdmin = () => {
    UserData.getUserByUsername('admin')
      .then((user) => {
        if (!user) {
          const salt = encryption.getSalt();
          const hash = encryption.getHash(salt, '123456');
          const roles = [roleTypes.Normal, roleTypes.Teacher, roleTypes.Admin];

          return UserData.createUser('admin', roles, salt, hash);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

        return SubjectData.addTeacherToSubjects(username, teacher.subjects);
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
    getProfile: async (req, res) => {
      if (req.roles.includes('Student')) {
        try {
          const profile = await StudentData.getStudentByUsername(req.username);
          res.json({ success: true, message: 'Данни изпратени успешно!', profile });
        } catch (error) {
          res.json({ success: false, message: 'Вътрешна грешка!' });
        }
      } else if (req.roles.includes('Teacher')) {
        try {
          const profile = await TeacherData.getTeacherByUsername(req.username);
          res.json({
            success: true,
            message: 'Данни изпратени успешно!',
            profile: profile || {},
          });
        } catch (error) {
          res.json({ success: false, message: 'ВЪтрешна грешка!' });
        }
      } else {
        res.json({ success: false, message: 'Вътрешна грешка!' });
      }
    },
    saveProfile: async (req, res) => {
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

        try {
          const encoding = await StudentData.createEncoding(photo);
          await StudentData.saveEncoding(username, encoding);
          res.json({ success: true, message: 'Настойките бяха успешно запазени!' });
        } catch (error) {
          res.json({ success: false, message: 'Вътрешна грешка!' });
        }
      } else {
        // add other stuff later
        res.redirect('/');
      }
    },
    registerUser: async (req, res) => {
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

        try {
          await registerStudent(firstName, lastName, username, group);
          await UserData.createUser(username, roles, salt, hash);

          res.json({
            success: true,
            message: 'Успешна регистрация!',
            roles,
            token,
          });
        } catch (error) {
          res.json({ success: false, message: error.message });
        }
      } else if (userType === roleTypes.Teacher) {
        if (typeof leadTeacher !== 'boolean') {
          return res.json({ success: false, message: 'Невалидни потребителски данни!' });
        }

        roles.push(roleTypes.Teacher);

        try {
          await registerTeacher({
            firstName,
            lastName,
            username,
            leadTeacher,
            group,
            subjects,
          });
          await UserData.createUser(username, roles, salt, hash);

          res.json({
            success: true,
            message: 'Успешна регистрация!',
            roles,
            username,
            token,
          });
        } catch (error) {
          res.json({ success: false, message: error.message });
        }
      } else {
        res.json({ success: false, message: 'Невалидни данни!' });
      }
    },
    loginUser: async (req, res) => {
      const { username, password } = req.body;

      try {
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
        res.send({
          success: true,
          message: 'Успешен вход!',
          roles: user.roles,
          username,
          token,
        });
      } catch (error) {
        res.json({ success: false, message: 'Невалидни данни' });
      }
    },
  };
}

module.exports = { init };
