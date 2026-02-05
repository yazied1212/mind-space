import { model, Schema, Types } from "mongoose"

//schema
const answerSchema=new Schema({
    answer:{type:String,required:true},
    questionId:{type:Types.ObjectId,required:true,ref:"Questions"},
    isCorrect:{type:Boolean,required:true}
},{
    versionKey:false,timestamps:true
})

//model
export const Answer=model("Answer",answerSchema)