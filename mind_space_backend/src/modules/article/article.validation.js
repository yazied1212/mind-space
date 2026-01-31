import joi from "joi";
import { generaleField } from "../../middlewares/isValid.js";

export const createArticleSchema = joi
  .object({
    content: joi.string(),
    attachments: joi.array().items(generaleField.attachments),
  })
  .or("content", "attachments")
  .required();



export const likeUnlikeSchema = joi
  .object({
    id: generaleField.id,
  })
  .required();


export const getArticlesSchema = joi.object({
  page: joi.number().min(1),
  size: joi.number().min(1),
});


export const getSpecificArticleSchema = joi
  .object({
    id: generaleField.id.required(),
  })
  .required();


export const archiveArticleSchema = joi
  .object({
    id: generaleField.id.required(),
  })
  .required();

  
export const restoreArticleSchema = joi
  .object({
    id: generaleField.id.required(),
  })
  .required();


export const deleteArticleSchema = joi
  .object({
    id: generaleField.id.required(),
  })
  .required();
  
export const undoArticleSchema = joi
  .object({
    id: generaleField.id.required(),
  })
  .required();
