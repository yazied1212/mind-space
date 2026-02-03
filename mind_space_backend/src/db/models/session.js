import { model, Schema, Types } from "mongoose"
import { sessionStatus } from "../../utils/index.js"

const messageSchema=new Schema({
    sender: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
},{
    versionKey:false,timestamps:true
})
//schema
const sessionSchema=new Schema({
   userId:{type:Types.ObjectId,ref:"User",required:true},
    therapistId:{type:Types.ObjectId,ref:"User",required:true},
    sessionTime:{type:String,required:true},
    status:{type:String,required:true,enum:sessionStatus},
    messages:[messageSchema]
},{
    versionKey:false,timestamps:true
})


//model
export const Session=model("session",sessionSchema)
