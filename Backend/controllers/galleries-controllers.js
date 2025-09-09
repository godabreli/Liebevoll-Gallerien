const { default: mongoose } = require('mongoose');
const fs = require('fs');
const path = require('path');
const { imageSizeFromFile } = require('image-size/fromFile');

const Gallery = require('../models/gallery');
const AppError = require('../utils/appError');

////////////////////// CHECK GALLERY NAME /////////////////////

exports.checkGalleryName = (req, res, next) => {
  const galleryName = req.body.name;

  if (!galleryName) return next(new AppError('Gallery name is required', 400));

  const folder = path.join(
    __dirname,
    '..',
    'uploads',
    'galleries',
    galleryName
  );

  try {
    if (fs.existsSync(folder))
      return next(new AppError('Gallery with this name already exists', 400));
  } catch (err) {
    console.log('error by checking the name: ', err);
  }

  res.status(200).json({ status: 'available' });
};

/////////////////////  CREATE GALLERIE  ///////////////////////////////////

exports.createGalery = async (req, res, next) => {
  const {
    name,
    password,
    passwordConfirm,
    altTexts,
    isProtected,
    downloadFunction,
  } = req.body;

  try {
    const imageArray = await Promise.all(
      req.files.map(async (image, i) => {
        try {
          const filePath = path.join(
            __dirname,
            '..',
            'uploads',
            'galleries',
            name,
            'resized',
            image.originalname
          );
          const dimensions = await imageSizeFromFile(filePath);
          return {
            name: image.originalname,
            path: `galleries/${req.body.name}/resized/${image.originalname}`,
            altText: altTexts[i],
            width: dimensions.width,
            height: dimensions.height,
          };
        } catch (err) {
          console.error(`fehler beim Abrufen der Bildgröße: ${err}`);
          return null;
        }
      })
    );

    const galleryData = {
      name,
      isProtected,
      downloadFunction,
      images: imageArray,
    };

    if (isProtected === 'true' || isProtected === true) {
      galleryData.password = password;
      galleryData.passwordConfirm = passwordConfirm;
    }

    const createdGallery = new Gallery(galleryData);

    await createdGallery.save();

    res.status(201).json({
      status: 'success',
      data: createdGallery.toObject({ getters: true }),
    });
  } catch (err) {
    return next(err);
  }
};

/////////////////////  DELETE GALLERIE  /////////////////////////////////

exports.deleteGallery = async (req, res, next) => {
  const galleryId = req.params.galleryId;
  let gallery;
  try {
    gallery = await Gallery.findById(galleryId);
  } catch (err) {
    return next(err);
  }

  if (!gallery)
    return next(new AppError('No gallerie found with that id', 400));

  const folder = path.join(
    __dirname,
    '..',
    'uploads',
    'galleries',
    galleryName
  );

  try {
    fs.rm(folder, { recursive: true, force: true }, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    return next(err);
  }

  try {
    await Gallery.findByIdAndDelete(galleryId);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({ status: 'success', message: 'Gallerie deleted' });
};

//////////////////////  GET ALL GALLERIES  /////////////////////////////

exports.getAllGalleries = async (req, res, next) => {
  let galleries;
  try {
    galleries = await Gallery.find({}, '-password -__v');
  } catch (err) {
    return next(err);
  }

  if (!galleries) return next(new AppError('No galleries found', 400));

  res.status(200).json({
    status: 'success',
    data: galleries.map((gallery) => gallery.toObject({ getters: true })),
  });
};

////////////////////////////// CHECK GALLERY //////////////////////////////////

exports.checkIfProtected = async (req, res, next) => {
  const galleryName = req.params.galleryName;

  let gallery;
  try {
    gallery = await Gallery.findOne({ name: galleryName });
  } catch (err) {
    return next(err);
  }

  if (!gallery)
    return next(new AppError('No gallery fount with that name', 400));

  if (gallery.isProtected)
    return next(new AppError('You do not have access to this gallery', 400));

  req.galleryData = { galleryId: gallery.id };

  next();
};

//////////////////////  GET GALLERIE BY ID  /////////////////////////////////

exports.getGalleryById = async (req, res, next) => {
  const galleryId = req.galleryData
    ? req.galleryData.galleryId
    : req.params.galleryId;

  let gallery;

  try {
    gallery = await Gallery.findById(galleryId, '-password -__v');
  } catch (err) {
    return next(err);
  }

  if (!gallery)
    return next(new AppError('No gallerie found with that id.', 400));

  res
    .status(201)
    .json({ status: 'success', data: gallery.toObject({ getters: true }) });
};

///////////////////////// UPDATE GALLERY ///////////////////////////////////////

exports.updateGallery = async (req, res, next) => {
  const galleryId = req.params.galleryId;
  const oldImageFiles = JSON.parse(req.body.oldImageFiles);
  const imagesToDelete = JSON.parse(req.body.imagesToDelete);
  const altTexts = JSON.parse(req.body.altTexts);
  const imageNames = JSON.parse(req.body.imageNames);

  const images = [];

  for (let i = 0; i < imageNames.length; i++) {
    const imageName = imageNames[i];
    const existingImage = oldImageFiles.find((el) => el.name === imageName);
    if (existingImage) {
      existingImage.altText = altTexts[i];
      images.push(existingImage);
    }

    if (!existingImage && req.files) {
      const uploadedImage = req.files.find(
        (el) => el.originalname === imageName
      );
      try {
        const imageFile = path.join(
          __dirname,
          '..',
          'uploads',
          'galleries',
          req.body.name,
          'resized',
          uploadedImage.originalname
        );
        const dimensions = await imageSizeFromFile(imageFile);
        const newImage = {
          name: uploadedImage.originalname,
          path: `galleries/${req.body.name}/resized/${uploadedImage.originalname}`,
          altText: altTexts[i],
          width: dimensions.width,
          height: dimensions.height,
        };
        images.push(newImage);
      } catch (err) {
        console.error(err);
      }
    }
  }

  try {
    const gallery = await Gallery.findById(galleryId);

    if (!gallery) throw Error('No gallery found with that id');

    await Gallery.findByIdAndUpdate(galleryId, {
      images,
    });
  } catch (err) {
    return next(err);
  }

  const resizedFolder = path.join(
    __dirname,
    '..',
    'uploads',
    'galleries',
    req.body.name,
    'resized'
  );
  const originalSizeFolder = path.join(
    __dirname,
    '..',
    'uploads',
    'galleries',
    req.body.name
  );

  imagesToDelete.forEach((image) => {
    fs.unlink(`${resizedFolder}/${image.name}`, (err) => {
      if (err) console.error(err);
    });

    if (
      req.body.downloadFunction === 'true' ||
      req.body.downloadFunction === true
    ) {
      fs.unlink(`${originalSizeFolder}/${image.name}`, (err) => {
        if (err) console.error(err);
      });
    }
  });

  res.status(201).json({ status: 'success', data: images });
};

exports.downloadOneImage = (req, res, next) => {
  const { imagePath } = req.body;

  res.download(imagePath, 'bild.jpg', (err) => {
    if (err) {
      next(err);
    }
  });
};
