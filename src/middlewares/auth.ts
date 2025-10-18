import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";
import { ApiError, errorMessages } from "../utils/errors";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, errorMessages.UNAUTHORIZED);
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new ApiError(401, errorMessages.INVALID_TOKEN);
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, errorMessages.FORBIDDEN);
  }
  next();
};
