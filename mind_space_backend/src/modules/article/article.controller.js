import { Router } from "express";
import { asyncHandler, cloudUpload, fileValidation, roles } from "../../utils/index.js";
import commentRouter from "../comment/comment.controller.js";
import { archiveArticle, createArticle, deleteArticle, getArticles, getSpecificArticle, likeUnlike, restoreArticle, undoArticle } from "./article.service.js";
import { archiveArticleSchema, createArticleSchema, deleteArticleSchema, getArticlesSchema, getSpecificArticleSchema, likeUnlikeSchema, restoreArticleSchema, undoArticleSchema } from "./article.validation.js";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";

const router=Router()
router.use("/:articleId/comment", commentRouter);
router.use(isAuthenticate);

router.post(
  "/",
   isAuthorized(roles.therapist),
  cloudUpload(...fileValidation.images, ...fileValidation.video).array(
    "attachments",
  ),
  isValid(createArticleSchema),
  asyncHandler(createArticle),
);
router.patch(
  "/like-unlike/:id",
   isAuthorized(roles.therapist),
  isValid(likeUnlikeSchema),
  asyncHandler(likeUnlike),
);
router.get("/", isValid(getArticlesSchema), asyncHandler(getArticles));

router.get(
  "/:id",
   isAuthorized(roles.therapist),
  isValid(getSpecificArticleSchema),
  asyncHandler(getSpecificArticle),
);

router.patch(
  "/archive/:id",
   isAuthorized(roles.therapist),
  isValid(archiveArticleSchema),
  asyncHandler(archiveArticle),
);

router.patch(
  "/restore/:id",
   isAuthorized(roles.therapist),
  isValid(restoreArticleSchema),
  asyncHandler(restoreArticle),
);

router.delete("/:id", isAuthorized([roles.therapist,roles.admin]),isValid(deleteArticleSchema), asyncHandler(deleteArticle));
router.delete("/undo/:id", isAuthorized(roles.therapist), isValid(undoArticleSchema), asyncHandler(undoArticle));

export default router