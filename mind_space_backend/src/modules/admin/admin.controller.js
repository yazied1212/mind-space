import { Router } from "express";
import { BanAccountSchema, idSchema, isAuthenticate, isAuthorized, isValid, UnBanAccountSchema } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addQuestions, deleteQuestion,BanAccount, updateAnswer, updateQuestion, viewQuestions, viewUsers, UnBanAccount, viewCVs,judgeCV} from "./admin.service.js";
import { addQuestionsSchema, judgeCvSchema, updateAnswerSchema, updateQuestionSchema, } from "./admin.validation.js";

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

export default router