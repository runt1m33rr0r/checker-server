const roleTypes = require('../utils/roletypes');
const settings = require('../config/settings');
const BaseController = require('../base/base.controller');

const TOKEN_EXPIRATION = '7d';

class UserController extends BaseController {
  constructor(...args) {
    super(...args);

    this.seedAdmin();
  }

  async seedAdmin() {
    try {
      if (!await this.data.user.getUserByUsername('admin')) {
        const salt = this.encryption.getSalt();
        const hash = this.encryption.getHash(salt, '123456');
        const roles = [roleTypes.Normal, roleTypes.Teacher, roleTypes.Admin];

        return this.data.user.createUser('admin', roles, salt, hash);
      }
    } catch (error) {
      /* eslint no-console: 0 */
      console.log(error);
    }
  }

  async createTeacher(firstName, lastName, username, isLead, groupName, subjects) {
    if (isLead) {
      const group = await this.data.group.getGroupByName(groupName);
      if (group) {
        const subjectCodes = await this.data.subject.getSubjectsByCodes(subjects);
        const teacher = await this.data.teacher.createTeacher(
          firstName,
          lastName,
          username,
          true,
          group,
          subjectCodes,
        );

        return this.data.subject.addTeacherToSubjects(username, teacher.subjects);
      }

      return Promise.reject(new Error('Невалидна група!'));
    }

    const subjectCodes = await this.data.subject.getSubjectsByCodes(subjects);
    const teacher = await this.data.teacher.createTeacher(
      firstName,
      lastName,
      username,
      false,
      '',
      subjectCodes,
    );
    return this.data.subject.addTeacherToSubjects(username, teacher.subjects);
  }

  async createStudent(firstName, lastName, username, groupName) {
    const group = await this.data.group.getGroupByName(groupName);
    if (group) {
      return this.data.student.createStudent(firstName, lastName, username, group);
    }

    return Promise.reject(new Error('Невалидна група!'));
  }

  async getProfile(req, res) {
    if (req.roles.includes('Student')) {
      try {
        const profile = await this.data.student.getStudentByUsername(req.username);
        return res.json({ success: true, message: 'Данни изпратени успешно!', profile });
      } catch (error) {
        return res.json({ success: false, message: 'Вътрешна грешка!' });
      }
    } else if (req.roles.includes('Teacher')) {
      try {
        const profile = await this.data.teacher.getTeacherByUsername(req.username);
        return res.json({
          success: true,
          message: 'Данни изпратени успешно!',
          profile: profile || {},
        });
      } catch (error) {
        return res.json({ success: false, message: 'Вътрешна грешка!' });
      }
    } else {
      return res.json({ success: false, message: 'Вътрешна грешка!' });
    }
  }

  async saveProfile(req, res) {
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
        const encoding = await this.data.student.createEncoding(photo);
        await this.data.student.saveEncoding(username, encoding);
        return res.json({ success: true, message: 'Настойките бяха успешно запазени!' });
      } catch (error) {
        return res.json({ success: false, message: 'Вътрешна грешка!' });
      }
    } else {
      // add other stuff later
      return res.redirect('/');
    }
  }

  async registerUser(req, res) {
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

    const salt = this.encryption.getSalt();
    const hash = this.encryption.getHash(salt, password);
    const roles = [roleTypes.Normal];

    const token = this.encryption.getToken(
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
        await this.createStudent(firstName, lastName, username, group);
        await this.data.user.createUser(username, roles, salt, hash);

        return res.json({
          success: true,
          message: 'Успешна регистрация!',
          roles,
          token,
        });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    } else if (userType === roleTypes.Teacher) {
      if (typeof leadTeacher !== 'boolean') {
        return res.json({ success: false, message: 'Невалидни потребителски данни!' });
      }

      roles.push(roleTypes.Teacher);

      try {
        await this.createStudent({
          firstName,
          lastName,
          username,
          leadTeacher,
          group,
          subjects,
        });
        await this.data.user.createUser(username, roles, salt, hash);

        return res.json({
          success: true,
          message: 'Успешна регистрация!',
          roles,
          username,
          token,
        });
      } catch (error) {
        return res.json({ success: false, message: error.message });
      }
    } else {
      return res.json({ success: false, message: 'Невалидни данни!' });
    }
  }

  async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      const user = await this.data.user.getUserByUsername(username);
      if (!user) {
        return res.json({ success: false, message: 'Невалиден потребител!' });
      }

      if (
        !await this.data.user.checkPassword(password, user.salt, user.hashedPass, this.encryption)
      ) {
        return res.json({ success: false, message: 'Невалиден потребител!' });
      }

      const token = this.encryption.getToken(
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
  }
}

module.exports = UserController;
