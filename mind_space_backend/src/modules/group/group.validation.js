import joi from "joi"

export const joinGroupSchema = joi.object({
    groupId: joi.string().hex().length(24).required()
}).required()

export const leaveGroupSchema = joi.object({
    groupId: joi.string().hex().length(24).required()
}).required()