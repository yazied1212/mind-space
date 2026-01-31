import { Router } from "express";
import { isAuthenticate } from "../../middlewares/auth.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { asyncHandler, cloudUpload, fileValidation, roles } from "../../utils/index.js";
import {isValid} from "../../middlewares/isValid.js"
import commentRouter from "../comment/comment.controller.js";
import { archiveArticle, createArticle, deleteArticle, getArticles, getSpecificArticle, likeUnlike, restoreArticle, undoArticle } from "./article.service.js";
import { archiveArticleSchema, createArticleSchema, deleteArticleSchema, getArticlesSchema, getSpecificArticleSchema, likeUnlikeSchema, restoreArticleSchema, undoArticleSchema } from "./article.validation.js";

const router=Router()
router.use("/:articleId/comment", commentRouter);
router.use(isAuthenticate, isAuthorized(roles.user));

router.post(
  "/",
  cloudUpload(...fileValidation.images, ...fileValidation.video).array(
    "attachments",
  ),
  isValid(createArticleSchema),
  asyncHandler(createArticle),
);
router.patch(
  "/like-unlike/:id",
  isValid(likeUnlikeSchema),
  asyncHandler(likeUnlike),
);
router.get("/", isValid(getArticlesSchema), asyncHandler(getArticles));

router.get(
  "/:id",
  isValid(getSpecificArticleSchema),
  asyncHandler(getSpecificArticle),
);

router.patch(
  "/archive/:id",
  isValid(archiveArticleSchema),
  asyncHandler(archiveArticle),
);

router.patch(
  "/restore/:id",
  isValid(restoreArticleSchema),
  asyncHandler(restoreArticle),
);

router.delete("/:id", isValid(deleteArticleSchema), asyncHandler(deleteArticle));
router.delete("/undo/:id", isValid(undoArticleSchema), asyncHandler(undoArticle));

export default router