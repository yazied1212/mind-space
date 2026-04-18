import { GM } from "../../db/models/group_members.js"
import { SG } from "../../db/models/support_group.js"
import { AppError } from "../../utils/error/AppError.js"

export const joinGroup = async (req, res, next) => {
    
        const { groupId } = req.params

   
        const group = await SG.findById(groupId)
        if (!group) {
            return next(new AppError("Group not found", 404))
        }
        
        const alreadyMember = await GM.findOne({
            groupId,
            usersId: req.authUser._id
        })

        if (alreadyMember) {
            return next(new AppError("You are already a member of this group", 400))
        }

        
        await GM.findOneAndUpdate(
            { groupId },
            { $addToSet: { usersId: req.authUser._id } }, 
            { upsert: true, new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Successfully joined the group"
        })

    
}

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
    const { name, description } = req.body

    const groupExists = await SG.findOne({ name })
    if (groupExists) {
        return next(new AppError("group already exists", 400))
    }

    const group = await SG.create({ name, description })

    return res.status(201).json({
        success: true,
        message: "group created successfully",
        result: group
    })
}

export const removeUserFromGroup = async(req,res,next)=>{
    const {groupId,userId} = req.params
    
    const updatedGroup = await GM.findOneAndUpdate(
        { groupId, usersId: userId },
        { $pull: { usersId: userId } },
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