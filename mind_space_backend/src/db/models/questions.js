import { model, Schema, Types } from "mongoose"

//schema
const questionSchema=new Schema({
    question:{type:String,required:true},
    type:{type:Number,required:true}
},{
    versionKey:false,timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

questionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "questionId",
});

//model
export const Question=model("Question",questionSchema)