const multer = require('multer');
const path = require('path');
const fs = require('fs');
const APP_CONSTANTS = require('../constants/app.constants');

const uploadPath = APP_CONSTANTS.FILE_UPLOAD.DESTINATION;

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (APP_CONSTANTS.FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: APP_CONSTANTS.FILE_UPLOAD.MAX_FILE_SIZE,
  },
});

module.exports = upload;
