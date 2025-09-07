const User = require('../models/user');
const crypto = require('crypto');

const Email = require('../utils/email');
const AppError = require('../utils/appError');

/////////////////////  CREATE USER////////////////////////////////

exports.createUser = async (req, res, next) => {
  const { loginName, password, passwordConfirm } = req.body;

  const confirmToken = crypto.randomBytes(32).toString('hex');

  const userConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  const userConfirmTokenExpires = Date.now() + 10 * 60 * 1000;

  let newUser;
  try {
    newUser = await User.create({
      loginName,
      password,
      passwordConfirm,
      userConfirmToken,
      userConfirmTokenExpires,
    });
  } catch (err) {
    return next(err);
  }

  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/users/confirmUser/${confirmToken}`;

  try {
    await new Email({ url }).sendUserConfirmToken();
  } catch (err) {
    return next(err);
  }

  res.status(200).json({
    status: 'success',
    message: 'Request was sendt to the website owner',
  });
};

//////////////////////  CONFIRM USER  ///////////////////////////////////

exports.confirmUser = async (req, res, next) => {
  const token = req.params.confirmToken;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  let user;
  try {
    user = await User.findOne({
      userConfirmToken: hashedToken,
      userConfirmTokenExpires: { $gt: Date.now() },
    });
  } catch (err) {
    return next(err);
  }

  if (!user) {
    return next(new AppError('Token expired', 400));
  }

  user.confirmedUser = true;
  user.userConfirmToken = undefined;
  user.userConfirmTokenExpires = undefined;

  try {
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    return next(err);
  }
  res.status(201).json({ status: 'success', message: 'User confirmed' });
};

/////////////////////////// SEND CUSTOMER REQUEST ///////////////////////////////////

exports.sendCustomerRequest = async (req, res, next) => {
  const { name, email, message } = req.body;
  try {
    await new Email({ name, email, message }).sendCustomerRequestEmail();
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ status: 'success', message: 'Email was sendt' });
};
