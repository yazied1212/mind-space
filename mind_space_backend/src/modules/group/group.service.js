import { GM } from "../../db/models/group_members.js"
import { JoinRequest } from "../../db/models/joinRequestSchema.js"
import { SG } from "../../db/models/support_group.js"
import { AppError } from "../../utils/error/AppError.js"


export const leaveGroup = async (req, res, next) => {
    const { groupId } = req.params

    const group = await SG.findById(groupId)
    if (!group) {
        return next(new AppError("Group not found", 404))
    }

    const updatedGroup = await GM.findOneAndUpdate(
        { groupId, usersId: req.authUser._id },
        { $pull: { usersId: req.authUser._id } },
        { new: true }
    )

    if (!updatedGroup) {
        return next(new AppError("You are not a member of this group", 400))
    }

    return res.status(200).json({
        success: true,
        message: "Successfully left the group"
    })
}

export const createGroup = async (req, res, next) => {
    const { adminId } = req.params
    const { name, description } = req.body

    const groupExists = await SG.findOne({ name })
    if (groupExists) {
        return next(new AppError("group already exists", 400))
    }

    const group = await SG.create({ name, description, adminId })

    return res.status(201).json({
        success: true,
        message: "group created successfully",
        result: group
    })
}

export const removeUserFromGroup = async(req,res,next)=>{
    const {groupId,userId} = req.params
    
    const updatedGroup = await GM.findOneAndUpdate(
        { groupId},
        { $pull: { usersId: userId },
         $addToSet: { blacklist: userId }},
        { new: true }
    )

    if(!updatedGroup){
        return next(new AppError("User is not a member of this group or group not found", 400))
    }

    return res.status(200).json({
        success:true,
        message:"User removed from group successfully"
    })  
    
}

export const updateGroup = async(req,res,next)=>{
    const {groupId}=req.params
    const {name,description}=req.body
    
    const updateData = {}

    if (name) updateData.name = name
    if (description) updateData.description = description

    const updatedGroup = await SG.findOneAndUpdate(
        {_id:groupId},
        updateData,
        {new:true}
    )
    if(!updatedGroup){
        return next(new AppError("Group not found",404))

    }
    return res.status(200).json({
        success:true,
        message:"Group updated successfully",
        result:updatedGroup
    })
}


export const joinGroupRequest = async (req, res, next) => {
    const { groupId } = req.params;

    const group = await SG.findById(groupId);
    if (!group) return next(new AppError("Group not found", 404));

    const alreadyMember = await GM.findOne({ groupId, usersId: req.authUser._id });
    if (alreadyMember) return next(new AppError("You are already a member", 400));

    const alreadyRequested = await JoinRequest.findOne({
        groupId,
        userId: req.authUser._id,
        status: "pending"
    });
    if (alreadyRequested) return next(new AppError("You already sent a request", 400));

    await JoinRequest.create({ groupId, userId: req.authUser._id });

    return res.status(200).json({ success: true, message: "Request sent successfully" });
};


export const getGroupMembers = async (req, res, next) => {
    const { groupId } = req.params;

    const groupMembers = await GM.findOne({ groupId }).populate("usersId", "name email");

    if (!groupMembers) {
        return next(new AppError("Group not found", 404));
    }

    const isMember = groupMembers.usersId.some(
        user => user._id.toString() === req.authUser._id.toString()
    );

    if (!isMember) {
        return next(new AppError("You are not a member of this group", 403));
    }

    return res.status(200).json({
        success: true,
        message: "Group members retrieved successfully",
        result: groupMembers.usersId
    });
};

// Admin accept or reject join requests -----> need to be implemented by socket.io for real-time updates to users