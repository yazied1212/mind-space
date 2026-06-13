import { TokenModel } from "../../db/models/token.js";
import { User } from "../../db/models/user.js";
import { AppError, messages, verifyToken } from "../../utils/index.js";

export const socketAuth = async (socket, next) => {
  try {
    const { authorization } = socket.handshake.auth;
    if (!authorization) {
      return next(new Error("token not found")); // 👈 Use next(new Error(...))
    }
    if (!authorization.startsWith("dash")) {
      return next(new Error("invalid bearer key"));
    }
    const token = authorization.split(" ")[1];

    const decoded = verifyToken({token});
    
    const isBlacklisted = await TokenModel.findOne({ jti: decoded.jti });
    if (isBlacklisted) {
     return next(new Error("token is invalid (logged out)"));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error(messages.user.notFound));
    }

    if (user.changeCredentialsTime?.getTime() > decoded.iat * 1000) {
       return next(new Error("Token is Expired"));
    }

    if (user.isDeleted) {
      return next(new Error("account deactivated please login first"));
    }
    
    if (user.bannedUntil && user.bannedUntil > Date.now()) {
        return next(new Error("your account is temporarily banned"));
    }

    if (user.deletedAt && user.deletedAt.getTime() > decoded.iat * 1000) {
      return next(new Error("token is destroyed"));
    }
    
    socket.authUser = user;
    socket.userId = user._id;
    return next(); // ✅ Connection approved!
    
  } catch (error) {
    return next(new Error(error.message));
  }
};
