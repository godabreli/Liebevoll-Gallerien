const JSZip = require('jszip');
const path = require('path');
const fs = require('fs');

const AppError = require('../utils/appError');

const imageDownload = async (req, res, next) => {
  try {
    const { imagePaths } = req.body;

    if (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0) {
      return next(new AppError('Keine Bilderpfade erhalten', 400));
    }

    const zip = new JSZip();

    for (const imagePath of imagePaths) {
      const filePath = path.join(process.cwd(), 'uploads', imagePath);
      const fileName = path.basename(filePath);

      try {
        await fs.promises.stat(filePath);
        const fileData = await fs.promises.readFile(filePath);

        zip.file(fileName, fileData);
      } catch (err) {
        console.warn(`Datei nicht gefunden: ${filePath}`);
      }
    }

    const archive = await zip.generateAsync({ type: 'nodebuffer' });

    if (Object.keys(zip.files).length === 0) {
      return next(
        new AppError('Keine der angegebenen Dateien wurde gefunden', 404)
      );
    }

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="download.zip"',
    });

    res.status(200).send(archive);
  } catch (error) {
    next(error);
  }
};

module.exports = imageDownload;
