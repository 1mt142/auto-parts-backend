import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ApiError } from '../utils/errors';

export const handleUploadError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error && err.message.includes('image files')) {
    return next(new ApiError(400, err.message));
  }
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return next(
      new ApiError(400, 'File too large. Maximum allowed size is 1MB.')
    );
  }

  next(err);
};
