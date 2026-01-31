import jwt from "jsonwebtoken";

export const verifyToken = (payload, key = process.env.TOKEN_KEY) => {
  try {
    return jwt.verify(payload, key);
  } catch (error) {
    return { error };
  }
};
