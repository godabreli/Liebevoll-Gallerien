const AppError = require('../utils/appError');

const handleDuplcateError = (err) => {
  const duplicate = Object.values(err.keyValue)[0];
  return new AppError(`Duplicate value: ${duplicate}`, 400);
};

const handleValidationError = (err) => {
  let message;
  if (err.message.split(':')[1].trim() === 'password')
    message = 'Password is shorter than the minimum allowed length (8)';
  if (err.message.split(':')[1].trim() === 'passwordConfirm')
    message = err.message.split(':')[2].trim();
  return new AppError(message, 400);
};

const handleInvalidIdError = () => {
  return new AppError('Invalid ID', 400);
};

const sendError = (err, req, res) => {
  return res
    .status(err.statusCode)
    .json({ status: 'error', message: err.message });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'An unknown error occurred!';

  if (res.headerSent) {
    return next(err);
  }

  if (err.code === 11000) err = handleDuplcateError(err);
  if (err.name === 'ValidationError') err = handleValidationError(err);
  if (err.name === 'CastError') err = handleInvalidIdError();

  sendError(err, req, res);
};
