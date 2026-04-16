import jwt from "jsonwebtoken";

export const verifyToken = ({ token = "",  key = process.env.TOKEN_KEY }) => {
  return jwt.verify(token, key);
};