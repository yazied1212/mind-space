import { model, Schema, Types } from "mongoose"
import { points } from "../../utils/index.js"

//schema
const answerSchema=new Schema({
    answer:{type:String,required:true},
    questionId:{type:Types.ObjectId,required:true,ref:"Questions"},
    points:{type:Number,required:true,enum:points}
},{
    versionKey:false,timestamps:true
})

//model
export const Answer=model("Answer",answerSchema)