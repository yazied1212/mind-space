import { Router } from "express";
import { idSchema, isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addQuestions, deleteQuestion, updateAnswer, updateQuestion, viewQuestions, viewUsers } from "./admin.service.js";
import { addQuestionsSchema, updateAnswerSchema, updateQuestionSchema, } from "./admin.validation.js";

const router =Router()
router.use(isAuthenticate,isAuthorized(roles.admin))
router.post("/add-questions",isValid(addQuestionsSchema),asyncHandler(addQuestions))
router.get("/questions",asyncHandler(viewQuestions))
router.delete("/delete-question/:id",isValid(idSchema),asyncHandler(deleteQuestion))
router.patch("/edit-question/:id",isValid(updateQuestionSchema),asyncHandler(updateQuestion))
router.patch("/edit-answer/:id",isValid(updateAnswerSchema),asyncHandler(updateAnswer))
router.get("/view-users",asyncHandler(viewUsers))

export default router