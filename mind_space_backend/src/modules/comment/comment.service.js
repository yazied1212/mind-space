import { Article } from "../../db/models/article.js";
import { Comment } from "../../db/models/comment.js";
import { messages } from "../../utils/index.js";

export const createComment = async (req, res, next) => {
  const { articleId, id } = req.params;
  const { content } = req.body;

  const articleExists = await Article.findById(articleId);
  if (!articleExists) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }
  const createdComment = await Comment.create({
    article: articleId,
    user: req.authUser._id,
    content,
    parentComment: id,
  });

  return res.status(201).json({
    success: true,
    data: createdComment,
  });
};


export const getComments = async (req, res, next) => {
  const { articleId, id } = req.params;

  const articleExists = await Article.findById(articleId);
  if (!articleExists) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  const comments = await Comment.find({
    article: articleId,
    parentComment: id,
  }).populate([
    { path: "user", select: "userName pfp.secure_url" },
  ]);

  return res.status(200).json({
    success: true,
    data: comments,
  });
};

export const deleteComment = async (req, res, next) => {
  const { articleId, id } = req.params;

  const articleExists = await Article.findById(articleId);
  if (!articleExists) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  const comment = await Comment.findById(id);

  if (
    ![comment.user.toString(), articleExists.publisher.toString()].includes(
      req.authUser.id,
    )
  ) {
    return next(new Error("not allowed", { cause: 401 }));
  }

  await comment.deleteOne();

  return res.status(200).json({
    success: true,
    messages: messages.comment.deletedSuccessfully,
  });
};
