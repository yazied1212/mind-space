import { genders } from "../../utils/index.js";
import joi from "joi";

export const updatedUserSchema = joi
  .object({
    userName: joi.string().min(2).max(25),
    email: joi.string().email(),
    password: joi.string(),
    cPassword: joi.string().valid(joi.ref("password")),
    gender: joi.string().valid(...genders),
  })
  .required();
