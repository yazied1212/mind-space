import { Router } from "express";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addFeedback, deleteFeedback, updateFeedback, viewFeedback } from "./feedback.service.js";
import addFeedbacksSchema, { updateFeedbackSchema } from "./feedback.validation.js";


const router = Router()
router.get("/",isAuthenticate,isAuthorized([roles.user,roles.therapist]),asyncHandler(viewFeedback));
router.post("/add_feedback",isAuthenticate,isAuthorized([roles.user])
,isValid(addFeedbacksSchema)
,asyncHandler(addFeedback));

router.delete("/delete_feedback/:feedbackId",isAuthenticate
    ,isAuthorized([roles.user,roles.admin])
    ,asyncHandler(deleteFeedback));

router.patch("/update_feedback/:feedbackId",isAuthenticate
    ,isAuthorized([roles.user]),isValid(updateFeedbackSchema)
    ,asyncHandler(updateFeedback));

export default router
