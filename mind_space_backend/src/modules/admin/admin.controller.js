import { Router } from "express";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addQuestions, deleteQuestion, viewQuestions } from "./admin.service.js";
import { addQuestionsSchema, deleteQuestionSchema } from "./admin.validation.js";

const router =Router()
router.use(isAuthenticate,isAuthorized(roles.admin))
router.post("/add-questions",isValid(addQuestionsSchema),asyncHandler(addQuestions))
router.get("/questions",asyncHandler(viewQuestions))
router.delete("/delete-question/:id",isValid(deleteQuestionSchema),asyncHandler(deleteQuestion))

export default router