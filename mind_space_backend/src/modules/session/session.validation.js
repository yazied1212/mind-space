import joi from 'joi';

export const requestSessionSchema = joi.object({
    therapistId: joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    
    // Validates that the input is a valid date and is in the future
    sessionTime: joi.date()
        .greater('now') 
        .required()
        .messages({
            'date.greater': 'Session time must be in the future.',
            'date.base': 'Invalid date format.'
        })
}).required();

export const delaySessionSchema = joi.object({
    // Validate the body field
    newTime: joi.date()
        .greater('now')
        .required()
        .messages({
            'date.greater': 'The new session time must be in the future.'
        }),

    // Validate the param field (since your middleware merges them)
    sessionId: joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid session ID format.'
        })
}).required();