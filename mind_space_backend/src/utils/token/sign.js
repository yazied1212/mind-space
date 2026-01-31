import jwt from "jsonwebtoken";

export const signToken = ({
  payload,
  key = process.env.TOKEN_KEY,
  options = {},
}) => {
  return jwt.sign(payload, key, options);
};
