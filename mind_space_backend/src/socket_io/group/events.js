import { GroupMessages } from "../../db/models/group messages.js";
import { GM } from "../../db/models/group_members.js";
import { SG } from "../../db/models/support_group.js";
import { messages } from "../../utils/index.js";

export const sendGroupMessage = async (socket, data) => {
    try {
        
    const {groupId, message} = data;

    if (!message?.trim()) {
      return socket.emit("error", {
        message: "message required",
      });
    }

    const group = await SG.findById(groupId);
    if(!group){
        return socket.emit("error",{
            message:messages.group.notFound,
            statusCode:404
        })
    }

    const isParticipant=await GM.findOne({groupId:groupId,usersId:socket.userId})
    if(!isParticipant){
        return socket.emit("error",{
            message:"not allowed",
            statusCode:401
        })
    }
    socket.to(groupId).emit("sendGroupMessage", {data: message });
      await GroupMessages.findOneAndUpdate(
        {groupId:groupId},
        { $push: { messages: { sender: socket.userId, message } } },
      );
    } catch (error) {
        return socket.emit("error",{
                message:error.message,
                statusCode:400
            })
    }
 
    
  };
;
