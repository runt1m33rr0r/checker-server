const mongoose = require('mongoose');

const roleTypes = require('../utils/roletypes');

const invalidUser = 'Невалидно потребителско име.';
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: 'Вече има потребител със същото потребителско име.',
    required: [true, invalidUser],
    minlength: [5, invalidUser],
    maxlength: [15, invalidUser],
  },
  roles: [
    {
      type: String,
      enum: { values: [...Object.values(roleTypes)], message: 'Невалидна роля.' },
      required: true,
    },
  ],
  salt: { type: String, required: true },
  hash: { type: String, required: true },
});

const User = mongoose.model('user', userSchema, 'users');
module.exports = { User };
