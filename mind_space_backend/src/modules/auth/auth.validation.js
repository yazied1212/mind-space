import joi from "joi";
<<<<<<< HEAD
import { genders, roles } from "../../utils/index.js";
import { logoutEnum } from "../../utils/token/getNewCredentials.js";
=======
import { logoutEnum } from "../../utils/token/getNewCredentials.js";
import { genders, roles, specialties } from "../../utils/index.js";
import { generaleField } from "../../middlewares/isValid.js";
>>>>>>> 9f536b4083d51b61878b2c524e1670f3ac395f8c


//register
export const signUpSchema = joi
  .object({
    userName: joi.string().min(2).max(25).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi
      .string()
      .valid(...genders)
      .required(),
    role:joi.string().valid(...Object.values(roles)).required(),
    age:joi.number().min(18).required(),
    specialty: joi.when("role", {
      is: roles.therapist,
      then: joi.string().valid(...specialties).required(),
      otherwise: joi.forbidden()
    }),
    
  })
  .required();


  export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();


  //refresh token
export const refreshTokenSchema = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();

 export const verifyOtpSchema = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
  })
  .required();

//forgetPassword
export const forgetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    newPassword: joi.string().required(),
    cNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

  export const otpSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

  
export const enable2FaSchema = joi
  .object({
    otp: joi.string().length(6).required(),
  })
  .required();


  //2 step login
export const twoFaLoginSchema = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
  })
  .required();

export const disable2Fa= joi.object({
    otp: joi.string().length(6).required(),
}).required()

//login with google
export const google = joi
  .object({
    idToken: joi.string().required(),
    role:joi.string().valid(...Object.values(roles)).required(),
  })
  .required();


  export const logoutValidation = 
  joi.object({
      flag : joi.string().valid(...Object.values(logoutEnum)).
      default(logoutEnum.stayLoggedIn),
    })
    .required();


