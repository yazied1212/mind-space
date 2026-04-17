import { Router } from "express";
import {  idSchema, isAuthenticate, isAuthorized, isValid,  } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
<<<<<<< HEAD
import { addQuestions, deleteQuestion,BanAccount, updateAnswer, updateQuestion, viewQuestions, viewUsers, UnBanAccount } from "./admin.service.js";
import { addQuestionsSchema, BanAccountSchema, UnBanAccountSchema, updateAnswerSchema, updateQuestionSchema, } from "./admin.validation.js";
=======
import { addQuestions, deleteQuestion,BanAccount, updateAnswer, updateQuestion, viewQuestions, viewUsers, UnBanAccount, viewCVs,judgeCV, viewReports} from "./admin.service.js";
import { addQuestionsSchema, judgeCvSchema, updateAnswerSchema, updateQuestionSchema, BanAccountSchema,UnBanAccountSchema} from "./admin.validation.js";
>>>>>>> 9f536b4083d51b61878b2c524e1670f3ac395f8c

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
router.get("/view-cvs",asyncHandler(viewCVs))
router.patch("/judge-cv/:id",isValid(judgeCvSchema),asyncHandler(judgeCV))
router.get("/reports",asyncHandler(viewReports))

export default router