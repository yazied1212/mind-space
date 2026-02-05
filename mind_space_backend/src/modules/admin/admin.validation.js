import joi from "joi";
import { testTypes } from "../../utils/index.js";
import { generaleField } from "../../middlewares/isValid.js";

export const addQuestionsSchema=joi.object({
    question:joi.string().required(),
    type:joi.string().valid(...testTypes).required(),
    answers:joi.array().items(joi.object({
        answer:joi.string().required(),
        isCorrect:joi.boolean().required()
    })).length(4).required()
}).required()

export const deleteQuestionSchema=joi.object({
    id:generaleField.id.required()
}).required()