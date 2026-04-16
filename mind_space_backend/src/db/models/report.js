import { Schema,Types,model } from "mongoose";
//schema
const reportSchema=new Schema({
    userId:{type:Types.ObjectId,required:true,ref:"User"},
    reportedUserId:{type:Types.ObjectId,required:true,ref:"User"},
    reason:{type:String,required:true,enum:[]},
    content:{type:String}

},{
    versionKey:false,
    timestamps:true
})



//model
export const Report=model("reports",reportSchema)