import { model, Schema, Types } from "mongoose"

//schema
const articleSchema=new Schema({
    publisher:{type:Types.ObjectId,required:true,ref:"User"},
    content:{type:String,required: function () {
        return this.attachments.length == 0;
      },},
    likes:[{type:Types.ObjectId,ref:"User"}],
    attachments:[{ secure_url: String, public_id: String }],
    isDeleted: { type: Boolean, default: false },
},{
    versionKey:false,
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

articleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
});

//model
export const Article=model("Article",articleSchema)
