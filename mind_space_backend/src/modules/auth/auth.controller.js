import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import {  activateAccount, Disable2Fa, enable2FA, forgetPassword, googleLogin,
   login, refreshToken, sendOTP, signUp, twoFaLogin, twoFaSendOtp, verifyOtp } from "./auth.service.js";

import { disable2Fa, enable2FaSchema, forgetPasswordSchema, google, loginSchema,
   otpSchema, refreshTokenSchema, signUpSchema, twoFaLoginSchema, verifyOtpSchema } from "./auth.validation.js";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";


const router=Router()
router.post("/sign-up",isValid(signUpSchema),asyncHandler(signUp))
router.get("/activate-account/:token", asyncHandler(activateAccount));
router.post("/login", isValid(loginSchema), asyncHandler(login));
router.post(
  "/refresh-token",
  isValid(refreshTokenSchema),
  asyncHandler(refreshToken),
);
router.post("/send-otp", isValid(otpSchema), asyncHandler(sendOTP));
router.post(
  "/forget-password-verify-otp",
  isValid(verifyOtpSchema),
  asyncHandler(verifyOtp),
);
router.post(
  "/forget-password",
  isValid(forgetPasswordSchema),
  asyncHandler(forgetPassword),
);
router.get(
  "/send-otp-2fa",
  isAuthenticate,
  isAuthorized([roles.user,roles.therapist]),
  asyncHandler(twoFaSendOtp),
);
router.post(
  "/enable-2fa",
  isAuthenticate,
  isAuthorized([roles.user,roles.therapist]),
  isValid(enable2FaSchema),
  asyncHandler(enable2FA),)

  router.post(
  "/2fa-login",
  isValid(twoFaLoginSchema),
  asyncHandler(twoFaLogin),
);

router.post(
  "/disable-2fa",isAuthenticate,
  isValid(disable2Fa),
  asyncHandler(Disable2Fa),
);

router.post("/google-login", isValid(google), asyncHandler(googleLogin));



export default router