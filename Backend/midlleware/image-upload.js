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
      const folder = `uploads/galleries/${req.body.name}`;
      try {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
      } catch (err) {
        console.log(err);
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
