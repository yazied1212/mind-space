import { GM } from "../../db/models/group_members.js"
import { SG } from "../../db/models/support_group.js"
import { AppError } from "../../utils/error/AppError.js"

export const joinGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params

        // check if group exists
        const group = await SG.findById(groupId)
        if (!group) {
            return next(new AppError("Group not found", 404))
        }
        
        // check if user already in this group
        const alreadyMember = await GM.findOne({
            groupId,
            usersId: req.authUser._id
        })

        if (alreadyMember) {
            return next(new AppError("You are already a member of this group", 400))
        }

        // add user to group
        await GM.findOneAndUpdate(
            { groupId },
            { $addToSet: { usersId: req.authUser._id } }, // prevents duplicates
            { upsert: true, new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Successfully joined the group"
        })

    } catch (error) {
        return next(error)
    }
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

    if (updatedGroup.usersId.length === 0) {
        await GM.deleteOne({ groupId })
    }

    return res.status(200).json({
        success: true,
        message: "Successfully left the group"
    })
}