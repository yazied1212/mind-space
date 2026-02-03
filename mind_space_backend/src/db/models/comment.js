import { model, Schema, Types } from "mongoose"

//schema
const commentSchema=new Schema({
    article:{type:Types.ObjectId,required:true,ref:"article"},
    user:{type:Types.ObjectId,required:true,ref:"User"},
    content:{type:String,required:true},
    likes: [{ type: Types.ObjectId, ref: "User" }],
    parentComment: { type: Types.ObjectId, ref: "Comment" },

},{
    versionKey:false,timestamps:true
})

commentSchema.post(
  "deleteOne",
  { query: false, document: true },

  async function (doc, next) {
    const replies = await this.constructor.find({ parentComment: doc._id });
    if (replies.length) {
      for (const reply of replies) {
        await reply.deleteOne();
      }
    }
  },
);

//model
export const Comment=model("Comment",commentSchema)
