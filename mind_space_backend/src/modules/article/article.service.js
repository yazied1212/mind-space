import { Article } from "../../db/models/article.js";
import { messages } from "../../utils/index.js";
import cloudinary from "../../utils/multer/cloud-config.js";

export const createArticle = async (req, res, next) => {
  let attachments = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `mind-space/users/${req.authUser._id}/articles` },
    );
    attachments.push({ secure_url, public_id });
  }

  const createdArticle = await Article.create({
    content: req.body.content,
    attachments,
    publisher: req.authUser._id,
  });

  return res.status(201).json({
    success: true,
    message: messages.article.createdSuccessfully,
    data:createdArticle,
  });
};

export const likeUnlike = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  const userIndex = article.likes.indexOf(req.authUser._id);
  if (userIndex == -1) {
    article.likes.push(req.authUser._id);
  } else {
    article.likes.splice(userIndex, 1);
  }

  const updatedArticle = await article.save();

  return res.status(200).json({
    success: true,
    data: updatedArticle,
  });
};

export const getArticles = async (req, res, next) => {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const skip = (page - 1) * size;

  const articles = await Article.find({ isDeleted: false })
    .populate([
      { path: "publisher", select: "userName pfp.secure_url" },
      { path: "likes", select: "userName pfp.secure_url" },
      {
        path: "comments",
        select: "user text",
        match: { parentComment: { $exists: false } },
      },
    ])
    .limit(size)
    .skip(skip);

  if (!articles) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    data: articles,
  })}

export const getSpecificArticle = async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findOne({ _id: id, isDeleted: false }).populate([
    { path: "publisher", select: "userName pfp.secure_url" },
    { path: "likes", select: "userName pfp.secure_url" },
    {
      path: "comments",
      select: "user text",
      match: { parentComment: { $exists: false } },
    },
  ]);

  if (!article) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    data: article,
  });
};                


export const archiveArticle = async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findOne({ _id: id, isDeleted: false });
  if (!article) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  if (article.publisher.toString() != req.authUser.id) {
    return next(new Error("not allowed", { cause: 401 }));
  }

  article.isDeleted = true;
  await article.save();

  return res.status(200).json({
    success: true,
    message: "article archived successfully",
  });
};
  

export const restoreArticle = async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findOne({ _id: id, isDeleted: true });
  if (!article) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  if (article.publisher.toString() != req.authUser.id) {
    return next(new Error("not allowed", { cause: 401 }));
  }

  article.isDeleted = false;
  await article.save();

  return res.status(200).json({
    success: true,
    message: "article restored successfully",
  });
};


export const deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findById(id).populate([
    {
      path: "comments",
      select: "attachment",
      match: { parentComment: { $exists: false } },
    },
  ]);
  if (!article) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  if (article.publisher.toString() != req.authUser.id) {
    return next(new Error("not allowed", { cause: 401 }));
  }

  for (const file of article.attachments) {
    await cloudinary.uploader.destroy(file.public_id);
  }

  for (const comment of article.comments) {
    if (comment.attachment.public_id) {
      await cloudinary.uploader.destroy(comment.attachment.public_id);
    }

    await comment.deleteOne();
  }

  await article.deleteOne();

  return res.status(200).json({
    success: true,
    message: messages.article.deletedSuccessfully,
  });
};


export const undoArticle = async (req, res, next) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) {
    return next(new Error(messages.article.notFound, { cause: 404 }));
  }

  if (article.publisher.toString() != req.authUser.id) {
    return next(new Error("now allowed", { cause: 401 }));
  }

  if (Date.now() > article.createdAt.getTime() + 120000) {
    return next(
      new Error("now allowed to undo after 2 minutes", { cause: 400 }),
    );
  }

  await article.deleteOne();

  return res.status(200).json({
    success: true,
    message: messages.article.deletedSuccessfully,
  });
};
