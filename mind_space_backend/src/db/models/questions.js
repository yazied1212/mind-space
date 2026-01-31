import { model, Schema, Types } from "mongoose"

//schema
const questionsSchema=new Schema({
    question:{type:String,required:true},
    correctAnswerId:{type:Types.ObjectId,required:true,ref:"Answers"}
},{
    versionKey:false,timestamps:true
})

//model
export const Questions=model("questions",questionsSchema)