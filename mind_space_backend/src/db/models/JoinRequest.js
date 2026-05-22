import { model, Schema, Types } from "mongoose"

const joinRequestSchema = new Schema({
    groupId: { type: Types.ObjectId, ref: "support_group", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { versionKey: false, timestamps: true })

export const JoinRequest = model("JoinRequest", joinRequestSchema)