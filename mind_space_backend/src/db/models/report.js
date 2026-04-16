import { Schema,Types,model } from "mongoose";
import { reportReasons } from "../../utils/index.js";
//schema
const reportSchema=new Schema({
    userId:{type:Types.ObjectId,required:true,ref:"User"},
    reportedUserId:{type:Types.ObjectId,required:true,ref:"User"},
    reason:{type:String,required:true,enum:reportReasons},
    content:{type:String,required:function(){
        if(this.reason=="other"||this.reason=="dangerous psychological advice"||this.reason=="unqualified therapist"){
            return true
        }
        else{return false}
    }}

},{
    versionKey:false,
    timestamps:true
})



//model
export const Report=model("reports",reportSchema)