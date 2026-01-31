import { User } from "../db/models/user.js";
import { messages, verifyToken } from "../utils/index.js";

export const isAuthenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("token not found", { cause: 404 }));
    }
    if (!authorization.startsWith("dash")) {
      return next(new Error("invalid barer key", { cause: 400 }));
    }
    const token = authorization.split(" ")[1];

    const { id, iat, error } = verifyToken(token);
    if (error) {
      return next(new Error(error.message));
    }

    const userExists = await User.findById(id);
    if (!userExists) {
      return next(new Error(messages.user.notFound, { cause: 404 }));
    }

    if (userExists.isDeleted === true) {
      return next(new Error("account deactivated please login first"));
    }

    if (userExists.deletedAt && userExists.deletedAt.getTime() > iat * 1000) {
      return next(new Error("token is destroyed", { cause: 400 }));
    }

    req.authUser = userExists;
    return next();
  } catch (error) {
    return next(new Error(error.message));
  }
};
