const mongoose = require('mongoose');

const roleTypes = require('../utils/roletypes');

const invalidUser = 'Невалидно потребителско име.';
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, invalidUser],
    minlength: [5, invalidUser],
    maxlength: [15, invalidUser],
  },
  roles: [{ type: String, enum: [...Object.values(roleTypes)], required: true }],
  salt: { type: String, required: true },
  hash: { type: String, required: true },
});

// class User {
//   constructor(username, roles, salt, hashedPass) {
//     if (
//       typeof username !== 'string' ||
//       username.length < 5 ||
//       username.length > 15 ||
//       username !== username.toLowerCase()
//     ) {
//       throw new Error('Невалидно потребителско име!');
//     }

//     if (!Array.isArray(roles) || roles.length === 0) {
//       throw new Error('Невалидни роли!');
//     } else {
//       roles.forEach((role) => {
//         const types = Object.values(roleTypes);
//         if (!types.includes(role)) {
//           throw new Error('Невалидна роля!');
//         }
//       });
//     }

//     if (typeof salt !== 'string') {
//       throw new Error('Невалидни данни!');
//     }

//     if (typeof hashedPass !== 'string') {
//       throw new Error('Невалидни данни!');
//     }

//     this.username = username;
//     this.hashedPass = hashedPass;
//     this.salt = salt;
//     this.roles = roles;
//   }
// }

const User = mongoose.model('user', userSchema, 'users');
module.exports = { User };
