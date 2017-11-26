const roleTypes = require('../utils/roletypes');
const settings = require('../config/settings');

function init({ data, encryption }) {
  const {
    UserData, TeacherData, GroupData, SubjectData, StudentData,
  } = data;

  function seedAdmin() {
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
  }

  seedAdmin();

  function registerTeacher(firstName, lastName, username, isLead, group, subjects) {
    if (isLead) {
      return GroupData.getGroupByName(group)
        .then((result) => {
          if (result) {
            return SubjectData.getSubjectsByCodes(subjects);
          }
          return Promise.reject(new Error('Невалидна група!'));
        })
        .then(subjectCodes =>
          TeacherData.createTeacher(firstName, lastName, username, true, group, subjectCodes))
        .then(result => SubjectData.addTeacherToSubjects(username, result.subjects));
    }
    return SubjectData.getSubjectsByCodes(subjects)
      .then(subjectCodes =>
        TeacherData.createTeacher(firstName, lastName, username, false, '', subjectCodes))
      .then(result => SubjectData.addTeacherToSubjects(username, result.subjects));
  }

  function registerStudent(firstName, lastName, username, group) {
    return StudentData.createStudent(firstName, lastName, username, group);
    // return GroupData.getGroupByName(group)
    //     .then((result) => {
    //         if (result) {
    //             return StudentData.createStudent(
    //                 firstName, lastName, username, group);
    //         } else {
    //             return Promise.reject({
    //                 message: 'Невалидна група!',
    //             });
    //         }
    //     });
  }

  function getUserByUsername(req, res) {
    const { username } = req.query;

    UserData.getUserByUsername(username)
      .then((user) => {
        if (!user) {
          return res.render('base/error', {
            error: {
              message: 'Такъв потребител не съществува!',
            },
          });
        }

        return res.send(user);
      })
      .catch(err =>
        res.render('base/error', {
          error: err,
        }));
  }

  function getUserById(req, res) {
    const { id } = req.query;

    UserData.getUserById(id)
      .then((user) => {
        if (!user) {
          return res.render('base/error', {
            error: {
              message: 'Такъв потребител не съществува!',
            },
          });
        }

        return res.send(user);
      })
      .catch(err =>
        res.render('base/error', {
          error: err,
        }));
  }

  return {
    searchUser(req, res) {
      const { username, id } = req.query;

      if (username) {
        return getUserByUsername(req, res);
      } else if (id) {
        return getUserById(req, res);
      }

      return res.render('base/error', {
        error: {
          message: 'Невалидна заявка!',
        },
      });
    },
    getLoginPage(req, res) {
      res.render('user/login');
    },
    getRegisterPage(req, res) {
      res.render('user/register');
    },
    getProfilePage(req, res) {
      if (req.user.roles.includes('Student')) {
        StudentData.getStudentByUsername(req.user.username)
          .then((user) => {
            res.render('user/profile', {
              student: user,
            });
          })
          .catch(err =>
            res.render('base/error', {
              error: err,
            }));
      } else if (req.user.roles.includes('Teacher')) {
        TeacherData.getTeacherByUsername(req.user.username)
          .then((user) => {
            res.render('user/profile', {
              teacher: user,
            });
          })
          .catch(err =>
            res.render('base/error', {
              error: err,
            }));
      } else {
        res.render('base/error', {
          error: {
            message: 'Вътрешна грешка!',
          },
        });
      }
    },
    saveProfile(req, res) {
      const { roles } = req.user;
      if (roles.includes('Student')) {
        if (
          !req.files ||
          !Array.isArray(req.files.photo) ||
          req.files.photo.length < 1 ||
          !req.files.photo[0] ||
          !req.files.photo[0].buffer
        ) {
          return res.render('base/error', {
            error: {
              message: 'Невалидни данни!',
            },
          });
        }

        const photo = req.files.photo[0].buffer;
        const { username } = req.user;

        StudentData.createEncoding(photo)
          .then(encoding => StudentData.saveEncoding(username, encoding))
          .then(() => {
            res.render('base/success', {
              success: {
                message: 'Настройките се запазиха успешно!',
              },
            });
          })
          .catch(err =>
            res.render('base/error', {
              error: err,
            }));
      } else {
        // add other stuff later
        res.redirect('/');
      }
    },
    registerUser(req, res) {
      if (req.user) {
        res.redirect('/unauthorized');
      }

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

      if (userType === roleTypes.Student) {
        roles.push(roleTypes.Student);
        registerStudent(firstName, lastName, username, group)
          .then(() => UserData.createUser(username, roles, salt, hash))
          .then(() => {
            const token = encryption.getToken(
              {
                roles,
                username,
              },
              settings.secret,
              86400,
            );
            res.status(200).json({
              message: 'Готово',
              token,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: err.message,
            });
          });
      } else if (userType === roleTypes.Teacher) {
        if (typeof leadTeacher !== 'boolean') {
          return res.status(500).json({
            message: 'Невалиден потребител!',
          });
        }

        roles.push(roleTypes.Teacher);

        registerTeacher(firstName, lastName, username, leadTeacher, group, subjects)
          .then(() => UserData.createUser(username, roles, salt, hash))
          .then(() => {
            const token = encryption.getToken(
              {
                roles,
                username,
              },
              settings.secret,
              86400,
            );
            res.status(200).json({
              message: 'Готово',
              token,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: err.message,
            });
          });
      } else {
        res.status(500).json({
          message: 'Невалиден потребител!',
        });
      }
    },
    loginUser(req, res) {
      const { username, password } = req.body;

      UserData.getUserByUsername(username).then((user) => {
        if (!user) {
          return res.status(500).send('Error on the server.');
        }

        if (!UserData.checkPassword(password, user.salt, user.hashedPass, encryption)) {
          return res.status(500).send('password error');
        }

        const token = encryption.getToken(
          {
            roles: user.roles,
            username,
          },
          settings.secret,
          86400,
        );
        res.status(200).send({
          message: 'cool',
          token,
        });
      });
    },
    getUnauthorized(req, res) {
      res.render('base/unauthorized');
    },
  };
}

module.exports = { init };
