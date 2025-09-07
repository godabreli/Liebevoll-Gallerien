const jwt = require('jsonwebtoken');

const Gallery = require('../models/gallery');
const User = require('../models/user');
const AppError = require('../utils/appError');

///////////////////////////  LOGIN GALLERIE //////////////////////////

exports.loginGallery = async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return next(new AppError('Please provide gallerie name and password', 400));
  }

  try {
    const gallery = await Gallery.findOne({ name: name });

    if (
      !gallery ||
      !(await gallery.checkPassword(password, gallery.password))
    ) {
      return next(new AppError('Incorect login or password', 401));
    }

    const token = jwt.sign(
      { galleryId: gallery.id, galleryName: gallery.name },
      process.env.JWT_SECRET_GALLERIE,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      status: 'success',
      data: { galleryName: gallery.name, galleryId: gallery.id, token },
    });
  } catch (err) {
    return next(
      new AppError(
        'Could not log you in, please check your credentials and try again.',
        500
      )
    );
  }
};

///////////////////  PROTECT  /////////////////////

const protect = (req, next, jwtSecret) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Authentication failed!', 400);
  }

  const decodedToken = jwt.verify(token, jwtSecret);

  return decodedToken;
};

///////////////////  PROTECT GALLERIE  ////////////////////

exports.protectGallery = (req, res, next) => {
  try {
    const decodedToken = protect(req, next, process.env.JWT_SECRET_GALLERIE);
    if (!decodedToken) {
      throw new AppError('Authentication Faild', 400);
    }
    req.galleryData = { galleryId: decodedToken.galleryId };
    next();
  } catch (err) {
    return next(err);
  }
};

////////////////////////  LOGIN USER /////////////////////////

exports.loginUser = async (req, res, next) => {
  const { loginName, password } = req.body;

  if (!loginName || !password) {
    return next(
      new AppError('Please provide your login name und password', 400)
    );
  }

  try {
    const user = await User.findOne({ loginName: loginName });

    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(new AppError('Incorect login or password!', 401));
    }

    if (!user.confirmedUser) {
      return next(
        new AppError(
          'Your acount is not confirmed, please contact the administrator',
          401
        )
      );
    }

    const token = jwt.sign(
      { userId: user.id, loginName: user.loginName },
      process.env.JWT_SECRET_USER,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      status: 'success',
      data: { loginName: user.loginName, userId: user.id, token },
    });
  } catch (err) {
    return next(
      new AppError(
        'Could not log you in, please check your credentials and try again.',
        500
      )
    );
  }
};

//////////////////////// PROTECT USER //////////////////////

exports.protectUser = (req, res, next) => {
  try {
    const decodedToken = protect(req, next, process.env.JWT_SECRET_USER);
    if (!decodedToken) {
      throw new AppError('Authentication Faild', 400);
    }
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(err);
  }
};

exports.protectDownload = (req, res, next) => {
  try {
    const jwtSecret =
      req.body.authType === 'user'
        ? process.env.JWT_SECRET_USER
        : process.env.JWT_SECRET_GALLERIE;

    const decodedToken = protect(req, next, jwtSecret);

    if (!decodedToken) {
      throw new AppError('Authentication Faild', 400);
    }

    req.galleryData = { galleryId: req.body.galleryId };
    next();
  } catch (err) {
    return next(err);
  }
};
