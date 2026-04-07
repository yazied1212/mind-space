import { Router } from "express";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addFeedbacks, viewFeedbacks } from "./feedback.service.js";
import addFeedbacksSchema from "./feedback.validation.js";


const router = Router()
router.get("/",isAuthenticate,isAuthorized([roles.user,roles.therapist]),asyncHandler(viewFeedbacks));
router.post("/add_feedback",isAuthenticate,isValid(addFeedbacksSchema),asyncHandler(addFeedbacks));

export default router
