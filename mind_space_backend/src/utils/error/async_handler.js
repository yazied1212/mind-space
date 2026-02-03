import { AppError } from "./AppError.js";

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(new AppError(error.message));
    }
  };
};
