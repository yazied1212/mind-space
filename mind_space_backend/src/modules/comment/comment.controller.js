import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import { createComment, deleteComment, getComments } from "./comment.service.js";
import { createCommentSchema, deleteCommentsSchema, getCommentsSchema } from "./comment.validation.js";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";

const router=Router(({ mergeParams: true }))
router.use(isAuthenticate, isAuthorized([roles.user,roles.therapist]));

router.post(
  "/",
  isValid(createCommentSchema),
  asyncHandler(createComment),
);
router.post(
  "/:id",
  isValid(createCommentSchema),
  asyncHandler(createComment),
);
router.get("/", isValid(getCommentsSchema), asyncHandler(getComments));
router.get("/:id", isValid(getCommentsSchema), asyncHandler(getComments));

router.delete(
  "/:id",
  isValid(deleteCommentsSchema),
  asyncHandler(deleteComment),
);



export default router