import { model, Schema, Types } from "mongoose"

//schema
const sgSchema=new Schema({
    name:{type:String,required:true},
    description:{type:String},
    adminId: { type: Types.ObjectId, ref: "User", required: true },
},{
    versionKey:false,
    timestamps:true
})

//model
export const SG=model("support_group",sgSchema)
