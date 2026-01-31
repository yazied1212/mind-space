import { Router } from "express";
import { isAuthenticate } from "../../middlewares/auth.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { isValid } from "../../middlewares/isValid.js";
import { createComment, deleteComment, getComments } from "./comment.service.js";
import { createCommentSchema, deleteCommentsSchema, getCommentsSchema } from "./comment.validation.js";

const router=Router()
router.use(isAuthenticate, isAuthorized(roles.user));
router.post(
  "/:id",
  isValid(createCommentSchema),
  asyncHandler(createComment),
);

router.get("/:id", isValid(getCommentsSchema), asyncHandler(getComments));
router.delete(
  "/:id",
  isValid(deleteCommentsSchema),
  asyncHandler(deleteComment),
);



export default router