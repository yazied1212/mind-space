import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import {  activateAccount, enable2FA, forgetPassword, login, refreshToken, sendOTP, signUp, twoFaLogin, twoFaSendOtp, verifyOtp } from "./auth.service.js";
import { isValid } from "../../middlewares/isValid.js";
import { enable2FaSchema, forgetPasswordSchema, loginSchema, otpSchema, refreshTokenSchema, signUpSchema, twoFaLoginSchema, verifyOtpSchema } from "./auth.validation.js";
import { isAuthenticate } from "../../middlewares/auth.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";

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
  isAuthorized(roles.user),
  asyncHandler(twoFaSendOtp),
);
router.post(
  "/enable-2fa",
  isAuthenticate,
  isAuthorized(roles.user),
  isValid(enable2FaSchema),
  asyncHandler(enable2FA),)

  router.post(
  "/2fa-login",
  isValid(twoFaLoginSchema),
  asyncHandler(twoFaLogin),
);




export default router