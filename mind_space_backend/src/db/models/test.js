import { model, Schema, Types } from "mongoose"

//schema
const testSchema=new Schema({
    userId:{type:Types.ObjectId,required:true,ref:"User"},
    score:{type:Number,required:true}
},{
    versionKey:false,timestamps:true
})

//model
export const Test=model("test",testSchema)