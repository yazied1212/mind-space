import joi from "joi";
import { questionsNumber, testTypes } from "../../utils/index.js";
import { generaleField } from "../../middlewares/isValid.js";

export const createTestSchema=joi.object({
    type:joi.string().valid(...testTypes).required()
}).required()


export const testResultSchema=joi.object({
    
    testId:generaleField.id.required(),
    submittedAnswers:joi.array().items(
        generaleField.id
    ).length(questionsNumber)

})