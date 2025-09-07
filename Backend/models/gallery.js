const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  name: { type: String, required: true, unique: true },
  isProtected: {
    type: Boolean,
    default: false,
  },
  downloadFunction: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [
      function () {
        return this.isProtected;
      },
      'Please provide a password',
    ],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [
      function () {
        return this.isProtected;
      },
      'Please confirm your password',
    ],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  images: [{ type: Object, required: [true, 'Please select the images'] }],
});

gallerySchema.pre('save', async function (next) {
  if (!this.password) return next();

  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

gallerySchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('Gallery', gallerySchema);
