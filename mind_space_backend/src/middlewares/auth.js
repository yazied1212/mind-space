import { User } from "../db/models/user.js";
import { AppError, messages, verifyToken } from "../utils/index.js";

export const isAuthenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new AppError("token not found",  404 ));
    }
    if (!authorization.startsWith("dash")) {
      return next(new AppError("invalid barer key",  400 ));
    }
    const token = authorization.split(" ")[1];

    const { id, iat, error } = verifyToken(token);
    if (error) {
      return next(new AppError(error.message));
    }

    const userExists = await User.findById(id);
    if (!userExists) {
      return next(new AppError(messages.user.notFound,  404 ));
    }

    if (userExists.isDeleted === true) {
      return next(new AppError("account deactivated please login first"));
    }

    if (userExists.deletedAt && userExists.deletedAt.getTime() > iat * 1000) {
      return next(new AppError("token is destroyed",   400 ));
    }

    req.authUser = userExists;
    return next();
  } catch (error) {
    return next(new AppError(error.message));
  }
};
