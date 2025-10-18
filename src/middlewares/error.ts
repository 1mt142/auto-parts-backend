import { Request, Response, NextFunction } from "express";
import { ApiError, errorMessages } from "../utils/errors";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  res.status(500).json({
    success: false,
    message: errorMessages.INTERNAL_ERROR,
  });
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
