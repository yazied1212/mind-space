import { model, Schema, Types } from "mongoose"
import { testStatus } from "../../utils/index.js"

//schema
const testSchema=new Schema({
    userId:{type:Types.ObjectId,required:true,ref:"User"},
    score:{type:Number,required:true,default:0},
    type:{type:Number,required:true},
    status:{type:String,required:true,enum:Object.values(testStatus),default:testStatus.inProgress},
    completedAt:{type:Date}
},{
    versionKey:false,timestamps:true
})

//model
export const Test=model("test",testSchema)