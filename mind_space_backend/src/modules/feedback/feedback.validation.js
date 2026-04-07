import joi from "joi";


export const addFeedbacksSchema = joi
  .object({
    therapistId: joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid Therapist ID format.'
            }),

        // Enforce specific star ratings (1, 2, 3, 4, 5)
        stars: joi.number()
            .integer()
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.min': 'Rating must be at least 1 star.',
                'number.max': 'Rating cannot exceed 5 stars.',
                'any.required': 'Star rating is required.'
            }),

        // Limit feedback length (e.g., max 500 characters)
        content: joi.string()
            .trim()
            .max(500)
            .allow('') // Allows empty string if user only wants to give stars
            .messages({
                'string.max': 'Feedback must be 500 characters or less.'
            })
    }) 
  .required();

export default addFeedbacksSchema;