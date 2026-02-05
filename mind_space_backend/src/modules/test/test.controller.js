import { Router } from "express";
import { createTest, testResult } from "./test.service.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";
import { createTestSchema, testResultSchema } from "./test.validation.js";

const router= Router()
router.use(isAuthenticate,isAuthorized(roles.user))

router.post("/:type",isValid(createTestSchema),asyncHandler(createTest))
router.post("/:testId/submit",isValid(testResultSchema),asyncHandler(testResult))

export default router