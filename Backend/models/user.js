const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const schema = mongoose.Schema;

const userSchema = new schema({
  loginName: {
    type: String,
    required: [true, 'User mast have login name.'],
    minlength: 5,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User mus have a password.'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
  confirmedUser: {
    type: Boolean,
    default: false,
  },
  userConfirmToken: String,
  userConfirmTokenExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
