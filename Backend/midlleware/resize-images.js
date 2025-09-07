const sharp = require('sharp');
const fs = require('fs');

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  const folderResized = `uploads/galleries/${req.body.name}/resized`;
  const folderOriginalImages = `uploads/galleries/${req.body.name}`;

  try {
    if (!fs.existsSync(folderResized)) {
      fs.mkdirSync(folderResized, { recursive: true });
    }
  } catch (err) {
    return next(err);
  }

  try {
    const resizePromises = req.files.map(async (image) => {
      const imageToResize = sharp(image.path);
      const metadata = await imageToResize.metadata();

      return imageToResize
        .resize(
          metadata.height > metadata.width || metadata.height === metadata.width
            ? { height: 1800 }
            : { width: 1800 }
        )
        .jpeg({ quality: 80 })
        .toFile(`${folderResized}/${image.originalname}`);
    });

    await Promise.all(resizePromises);

    if (
      req.body.downloadFunction === 'false' ||
      req.body.downloadFunction === false
    ) {
      for (image of req.files)
        fs.unlink(`${folderOriginalImages}/${image.originalname}`, (err) => {
          if (err) console.log(err);
        });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = resizeImages;
