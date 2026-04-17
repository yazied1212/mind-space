import { Router } from "express";
import { asyncHandler, cloudUpload, fileValidation, roles } from "../../utils/index.js";
import { deactivate, profile, report, resetPfp, updateUser, upPfp } from "./user.service.js";
import { reportSchema, updatedUserSchema } from "./user.validation.js";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";


const router =Router()

router.use(isAuthenticate, isAuthorized([roles.user,roles.therapist]));

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
router.patch("/reset-profile-picture",asyncHandler(resetPfp))
router.post("/report/:id",isValid(reportSchema),asyncHandler(report))





export default router