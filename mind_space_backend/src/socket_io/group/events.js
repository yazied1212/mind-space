import { GroupMessages } from "../../db/models/group messages.js";
import { GM } from "../../db/models/group_members.js";
import { SG } from "../../db/models/support_group.js";
import { messages } from "../../utils/index.js";
import { JoinRequest } from "../../db/models/JoinRequest.js";
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

export const requestJoinGroup = async (socket, data) => {
    const { groupId } = data

    try {
        // check group exists
        const group = await SG.findById(groupId)
        if (!group) {
            return socket.emit("error", {
                message: "Group not found",
                statusCode: 404
            })
        }

        // check not already a member
        const alreadyMember = await GM.findOne({
            groupId,
            usersId: socket.userId
        })
        if (alreadyMember) {
            return socket.emit("error", {
                message: "You are already a member of this group",
                statusCode: 400
            })
        }

        // check not already requested
        const alreadyRequested = await JoinRequest.findOne({
            groupId,
            userId: socket.userId,
            status: "pending"
        })
        if (alreadyRequested) {
            return socket.emit("error", {
                message: "You already have a pending request",
                statusCode: 400
            })
        }

        // create request in DB
        const joinRequest = await JoinRequest.create({
            groupId,
            userId: socket.userId
        })

        // notify the user
        socket.emit("joinRequestSent", {
            message: "Your request has been sent",
            data: joinRequest
        })

        // notify the admin
        socket.to(group.adminId.toString()).emit("newJoinRequest", {
            message: "New join request",
            data: joinRequest
        })

    } catch (error) {
        return socket.emit("error", {
            message: error.message,
            statusCode: 400
        })
    }
}