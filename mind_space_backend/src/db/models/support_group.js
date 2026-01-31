import { model, Schema, Types } from "mongoose"

//schema
const sgSchema=new Schema({
    name:{type:String,required:true},
    description:{type:String},
},{
    versionKey:false,
    timestamps:true
})

//model
export const SG=model("support_group",sgSchema)
