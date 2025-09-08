const path = require('path');
const multer = require('multer');
const fs = require('fs');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join(
        __dirname,
        '..',
        'uploads',
        'galleries',
        req.body.name
      );
      console.log(folder);

      try {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
      } catch (err) {
        console.log('Fehler beim Erstellen des Upload-Ordners: ', err);
        return cb(err);
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid file!');
    cb(error, isValid);
  },
});

module.exports = fileUpload;
