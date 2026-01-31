import { Router } from "express";
import { isAuthenticate } from "../../middlewares/auth.js";
import { asyncHandler, cloudUpload, fileValidation, roles } from "../../utils/index.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { deactivate, profile, updateUser, upPfp } from "./user.service.js";
import { updatedUserSchema } from "./user.validation.js";
import { isValid } from "../../middlewares/isValid.js";

const router =Router()

router.use(isAuthenticate, isAuthorized(roles.user));
router.get("/profile", asyncHandler(profile));
router.delete("/deactivate", asyncHandler(deactivate));
router.put(
  "/update-user",
  isValid(updatedUserSchema),
  asyncHandler(updateUser),
);
router.post(
  "/profile-picture",
  cloudUpload(fileValidation.images).single("pfp"),
  asyncHandler(upPfp),
);





export default router