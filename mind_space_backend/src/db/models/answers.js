import { model, Schema, Types } from "mongoose"

//schema
const answersSchema=new Schema({
    answer:{type:String,required:true},
    questionId:{type:Types.ObjectId,required:true,ref:"Questions"}
},{
    versionKey:false,timestamps:true
})

//model
export const Answers=model("answers",answersSchema)