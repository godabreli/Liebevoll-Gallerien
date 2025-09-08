const express = require('express');

const galleryController = require('../controllers/galleries-controllers');
const authController = require('../controllers/auth-controllers');
const fileUpload = require('../midlleware/image-upload');
const downloadEmages = require('../midlleware/download-images');
const resizeImages = require('../midlleware/resize-images');

const router = express.Router();

router.get('/', authController.protectUser, galleryController.getAllGalleries);
router.post('/login', authController.loginGallery);

router.get(
  '/get-user-gallery/:galleryId',
  authController.protectUser,
  galleryController.getGalleryById
);

router.get(
  '/get-gallery/:galleryName',
  authController.protectGallery,
  galleryController.getGalleryById
);

router.get(
  '/my-galleries/:galleryName',
  galleryController.checkIfProtected,
  galleryController.getGalleryById
);

router.post(
  '/checkGalleryName',
  authController.protectUser,
  galleryController.checkGalleryName
);

router.post(
  '/createGallerie',
  // authController.protectUser,
  (req, res, next) => {
    console.log('Body before Multer:', req.body);
    next();
  },
  fileUpload.array('images'),
  resizeImages,
  galleryController.createGalery
);

router.patch(
  '/updateGallery/:galleryId',
  authController.protectUser,
  fileUpload.array('images'),
  resizeImages,
  galleryController.updateGallery
);

router.delete(
  '/deleteGallerie/:galleryId',
  authController.protectUser,
  galleryController.deleteGallery
);

router.post(
  '/downloads/download-images',
  authController.protectDownload,
  downloadEmages
);

router.post(
  '/downloads/download-one-image',
  authController.protectDownload,
  galleryController.downloadOneImage
);

module.exports = router;
