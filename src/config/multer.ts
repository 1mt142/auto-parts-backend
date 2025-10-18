import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB max
  },
});

// Patch Multer to include a friendly message for size errors
const originalSingle = upload.single.bind(upload);
upload.single = (fieldName: string) => {
  const middleware = originalSingle(fieldName);
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err && err.code === 'LIMIT_FILE_SIZE') {
        err.message = 'File too large. Maximum allowed size is 1MB.';
      }
      next(err);
    });
  };
};

export { upload };
