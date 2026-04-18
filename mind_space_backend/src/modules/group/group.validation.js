import joi from "joi"

export const joinGroupSchema = joi.object({
    groupId: joi.string().hex().length(24).required()
}).required()

export const leaveGroupSchema = joi.object({
    groupId: joi.string().hex().length(24).required()
}).required()

export const createGroupSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    description: joi.string().min(10).max(200)
}).required()

export const removeUserFromGroupSchema = joi.object({
    groupId: joi.string().hex().length(24).required(),
    userId: joi.string().hex().length(24).required()
}).required()