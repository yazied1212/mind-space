import { GroupMessages } from "../../db/models/group messages.js";
import { GM } from "../../db/models/group_members.js";
import { SG } from "../../db/models/support_group.js";
import { messages } from "../../utils/index.js";
import { JoinRequest } from "../../db/models/JoinRequest.js";

export const joinGroupRoom = async (socket, data) => {
    const { groupId } = data;

    const group = await SG.findById(groupId);
    if (!group) {
        return socket.emit("errorMessage", {
            message: "Group not found",
            statusCode: 404
        });
    }

    const isMember = await GM.findOne({ groupId, usersId: socket.userId });
    const isAdmin = group.adminId.toString() === socket.userId.toString();

    if (!isMember && !isAdmin) {
        return socket.emit("errorMessage", {
            message: "You are not a member of this group",
            statusCode: 403
        });
    }

    socket.join(groupId);
    socket.emit("joinedGroupRoom", { groupId, message: "Joined group room successfully" });
};

export const leaveGroupRoom = async (socket, data) => {
    const { groupId } = data;
    socket.leave(groupId);
    socket.emit("leftGroupRoom", { groupId, message: "Left group room successfully" });
};

export const sendGroupMessage = async (socket, data) => {
    const { groupId, message } = data;

    if (!message?.trim()) {
      return socket.emit("errorMessage", {
        message: "message required",
      });
    }

    const group = await SG.findById(groupId);
    if(!group){
        return socket.emit("errorMessage",{
            message:messages.group.notFound,
            statusCode:404
        })
    }

    const isMember = await GM.findOne({ groupId, usersId: socket.userId });
    const isAdmin = group.adminId.toString() === socket.userId.toString();

    if (!isMember && !isAdmin) {
        return socket.emit("errorMessage",{
            message:"not allowed",
            statusCode:401
        })
    }

    const messageData = {
        sender: {
            _id: socket.userId,
            userName: socket.authUser.userName,
            pfp: socket.authUser.pfp
        },
        message: message.trim(),
        createdAt: new Date()
    };

    // Broadcast to others in the group room
    socket.to(groupId).emit("receiveGroupMessage", {
        groupId,
        data: messageData
    });

    // Save to database (upsert if not exists)
    await GroupMessages.findOneAndUpdate(
      { groupId: groupId },
      { $push: { messages: { sender: socket.userId, message: message.trim() } } },
      { upsert: true, new: true }
    );

    // Confirm to sender
    socket.emit("groupMessageSent", {
        groupId,
        data: messageData
    });
};

export const requestJoinGroup = async (socket, data) => {
    const { groupId } = data;

    const group = await SG.findById(groupId);
    if (!group) {
        return socket.emit("errorMessage", {
            message: "Group not found",
            statusCode: 404
        });
    }

    const alreadyMember = await GM.findOne({
        groupId,
        usersId: socket.userId
    });
    if (alreadyMember) {
        return socket.emit("errorMessage", {
            message: "You are already a member of this group",
            statusCode: 400
        });
    }

    const alreadyRequested = await JoinRequest.findOne({
        groupId,
        userId: socket.userId,
        status: "pending"
    });
    if (alreadyRequested) {
        return socket.emit("errorMessage", {
            message: "You already have a pending request",
            statusCode: 400
        });
    }

    const joinRequest = await JoinRequest.create({
        groupId,
        userId: socket.userId
    });

    socket.emit("joinRequestSent", {
        message: "Your request has been sent",
        data: joinRequest
    });

    socket.to(group.adminId.toString()).emit("newJoinRequest", {
        message: "New join request",
        data: joinRequest
    });
};