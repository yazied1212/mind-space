import { TokenModel } from "../../db/models/token.js";
import { User } from "../../db/models/user.js";
import { AppError, messages, verifyToken } from "../../utils/index.js";

export const socketAuth = async (socket, next) => {
  try {
    const { authorization } = socket.handshake.auth;
    if (!authorization) {
      return socket.emit("error",{
        message:"token not found",
        statusCode:404
      })
    }
    if (!authorization.startsWith("dash")) {
      return socket.emit("error",{
        message:"invalid bearer key",
        statusCode:400
      })
    }
    const token = authorization.split(" ")[1];

    const decoded = verifyToken({token});
    
   const isBlacklisted = await TokenModel.findOne({
    jti: decoded.jti,
    });
    if (isBlacklisted) {
     return socket.emit("error",{
        message:"token is invalid (logged out)",
        statusCode:401
      })
    }

    const user = await User.findById(decoded.id);
    

    if (!user) {
      return socket.emit("error",{
        message:messages.user.notFound,
        statusCode:404
      })
    }

    if (user.changeCredentialsTime?.getTime() > decoded.iat * 1000) {
   return socket.emit("error",{
        message:"Token is Expired",
        statusCode:401
      })
};

    if (user.isDeleted) {
      return socket.emit("error",{
        message:"account deactivated please login first",
        statusCode:400
      })
    }
    
    if (user.bannedUntil && user.bannedUntil > Date.now()) {
        return socket.emit("error",{
        message:"your account is temporarily banned",
        statusCode:403
      })
      }
      

    if (user.deletedAt && user.deletedAt.getTime() > decoded.iat * 1000) {
      return socket.emit("error",{
        message:"token is destroyed",
        statusCode:400
      })
    }
    
    //*req.decoded = decoded;*/
    socket.authUser = user;
    socket.userId=user._id
    return next();
  } catch (error) {
   return socket.emit("error",{
        message:error.message,
        statusCode:400
      })
  }
};
