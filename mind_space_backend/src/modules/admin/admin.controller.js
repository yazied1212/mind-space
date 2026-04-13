import { Router } from "express";
import {  idSchema, isAuthenticate, isAuthorized, isValid,  } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addQuestions, deleteQuestion,BanAccount, updateAnswer, updateQuestion, viewQuestions, viewUsers, UnBanAccount } from "./admin.service.js";
import { addQuestionsSchema, BanAccountSchema, UnBanAccountSchema, updateAnswerSchema, updateQuestionSchema, } from "./admin.validation.js";

const router =Router()
router.use(isAuthenticate,isAuthorized(roles.admin))
router.post("/add-questions",isValid(addQuestionsSchema),asyncHandler(addQuestions))
router.get("/questions",asyncHandler(viewQuestions))
router.delete("/delete-question/:id",isValid(idSchema),asyncHandler(deleteQuestion))
router.delete("{/:id}/ban-account",isValid(BanAccountSchema),asyncHandler(BanAccount));
router.delete("{/:id}/unban-account",isValid(UnBanAccountSchema), asyncHandler(UnBanAccount));
router.patch("/edit-question/:id",isValid(updateQuestionSchema),asyncHandler(updateQuestion))
router.patch("/edit-answer/:id",isValid(updateAnswerSchema),asyncHandler(updateAnswer))
router.get("/view-users",asyncHandler(viewUsers))

export default router