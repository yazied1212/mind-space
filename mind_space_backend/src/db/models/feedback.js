import { model, Schema, Types } from "mongoose"
import { stars } from "../../utils/index.js"

//schema
const feedbackSchema=new Schema({
    userId:{type:Types.ObjectId,ref:"User",required:true},
    therapistId:{type:Types.ObjectId,ref:"User",required:true},
    stars:{type:Number,required:true,enum:stars},
    content:{type:String}
},{
    versionKey:false,timestamps:true
})

//model
export const Feedback=model("feedback",feedbackSchema)
