import joi from "joi";
import { testTypes } from "../../utils/index.js";
import { generaleField } from "../../middlewares/isValid.js";

export const addQuestionsSchema = joi.object({
    questions: joi.array().items({
        question: joi.string().required(),
        type: joi.string().valid(...testTypes).required(),
        answers: joi.array().items(joi.object({
            answer: joi.string().required(),
            points: joi.number().required()
        })).length(5).required()
    }).required()
});

export const updateQuestionSchema=joi.object({
    id:generaleField.id.required(),
    question:joi.string(),
    type:joi.string().valid(...testTypes)
}).or('question', 'type').required()

export const updateAnswerSchema=joi.object({
    id:generaleField.id.required(),
    answer:joi.string(),
    points:joi.number()
}).or('answer', 'points').required()