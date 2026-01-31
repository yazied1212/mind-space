import { model, Schema, Types } from "mongoose"

//schema
const gmSchema=new Schema({
    groupId:{type:Types.ObjectId,required:true,ref:"SG"},
    usersId:[{type:Types.ObjectId,ref:"User",
        validate:{
            validator:arr=>arr.length>=2,
            message:"the group must have at least 2 members"
        }
    }]
},
    {
    versionKey:false,
    timestamps:true
}
)

//model
export const GM=model("group_members",gmSchema)