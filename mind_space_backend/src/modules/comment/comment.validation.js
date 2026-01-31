import joi from "joi";
import { generaleField } from "../../middlewares/isValid.js";


export const createCommentSchema = joi
  .object({
    articleId: generaleField.id.required(),
    id: generaleField.id,
    content: joi.string(),
  }).required();


  //get comments validation
export const getCommentsSchema = joi
  .object({
    articleId: generaleField.id.required(),
    id: generaleField.id,
  })
  .required();


  //delete comment validation
export const deleteCommentsSchema = joi
  .object({
    articleId: generaleField.id.required(),
    id: generaleField.id.required(),
  })
  .required();
