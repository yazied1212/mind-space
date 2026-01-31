import { model, Schema, Types } from "mongoose"


//schema
const messageSchema=new Schema({
    sender: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
},{
    versionKey:false,timestamps:true
})

const groupMessagesSchema=new Schema({
    groupId:{type:Types.ObjectId,required:true,ref:"SG"},
    messages:[messageSchema],

},
    {
    versionKey:false,
    timestamps:true
}
)

//model
export const GroupMessages=model("group_messages",groupMessagesSchema)