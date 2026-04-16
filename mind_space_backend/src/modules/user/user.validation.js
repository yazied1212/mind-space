import { generaleField } from "../../middlewares/isValid.js";
import { genders, reportReasons } from "../../utils/index.js";
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

export const reportSchema=joi.object({
  id:generaleField.id.required(),
  reason:joi.string().valid(...reportReasons).required(),
  content:joi.string().when('reason', {
    is: joi.valid('other','dangerous psychological advice', 'unqualified therapist'),
    then: joi.required(),
    otherwise: joi.optional()})
})


  