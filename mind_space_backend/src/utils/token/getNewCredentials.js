import { nanoid } from "nanoid";
import { signToken } from "./sign.js";

export const logoutEnum = {
    logoutFromAllDevices: "logoutFromAllDevices",
    logout: "logout",
    stayLoggedIn : "stayLoggedIn",
};

export const getNewLoginCredentials = async (user) => {
  const jwtid = nanoid();

  const accessToken = signToken({
    payload: { id: user._id },
    options: {
      expiresIn: "1h",
      jwtid,
    },
  });

  const refreshToken = signToken({
    payload: { id: user._id },
    options: {
      expiresIn: "1y",
      jwtid,
    },
  });

  return { accessToken, refreshToken };
};