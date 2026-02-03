import { AppError } from "../utils/index.js";

export function isAuthorized(allowedRole = []) {
  return (req, res, next) => {
    if (!allowedRole.includes(req.authUser.role)) {
      return next(new AppError("not authorized",  401 ));
    }

    return next();
  };
}
