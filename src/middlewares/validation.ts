import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { ApiError, errorMessages } from "../utils/errors";

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message);
      throw new ApiError(400, errorMessages.VALIDATION_ERROR, messages);
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      const messages = error.details.map((d) => d.message);
      throw new ApiError(400, errorMessages.VALIDATION_ERROR, messages);
    }

    req.query = value;
    next();
  };
};
