import { Feedback } from "../../db/models/feedback.js"
import { User } from "../../db/models/user.js";
import { AppError, messages, roles } from "../../utils/index.js"

//give feedback
export const addFeedback = async(req,res,next)=>{
    const { therapistId, stars, content } = req.body;
        const userId = req.authUser._id; // Assuming user is attached via auth middleware

        // 1. Prevent self-reviewing
        if (userId.toString() === therapistId.toString()) {
            return next(new AppError("You cannot provide feedback for yourself"),400)
        }
        // 2. Validate therapist existence
        const therapist = await User.findById(therapistId);
        if (!therapist || therapist.role !== 'therapist') {
            return  next(new AppError("therapist not found",404))
        }

        // 3. Check if user already gave feedback to this specific therapist
        const existingFeedback = await Feedback.findOne({ userId, therapistId });
        if (existingFeedback) {
            return next(new AppError("You have already provided feedback for this therapist.",404))
        }

        // 4. Create feedback
        const feedback = await Feedback.create({
            userId,
            therapistId,
            stars,
            content
        });

        return res.status(201).json({
            status: "Success",
            data: feedback
        });

}
//delete feedback
export const deleteFeedback = async(req ,res ,next)=>{
const { feedbackId } = req.params;
    const userId = req.authUser._id; // Using your authUser variable

    // 1. Find the feedback
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return next(new AppError("Feedback not found"),404)

    }

    // 2. Check Ownership: Does the userId of the feedback match the logged-in user?
   if (req.authUser.role !== roles.admin && feedback.userId.toString() !== userId.toString()) {
    return next(new AppError("You are not authorized to perform this action.", 403));
    }
    // 3. Delete the feedback
    await feedback.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Feedback deleted successfully."
    });
};
//update feedback
export const updateFeedback = async(req , res , next)=>{
const { feedbackId } = req.params;
    const { stars, content } = req.body;
    const userId = req.authUser._id;

    // 1. Find the feedback
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
            return next(new AppError("Feedback not found"),404)
    }

    // 2. Security Check: Only the owner can update
    if (feedback.userId.toString() !== userId.toString()) {
      return next(new AppError("You are not authorized to update this feedback."),403)

    }
    // 3. Update the fields if they are provided
    if (stars) feedback.stars = stars;
    if (content !== undefined) feedback.content = content;

    await feedback.save();

    return res.status(200).json({
        success: true,
        message: "Feedback updated successfully",
        data: feedback
    });

}

//view feedbacks
export const viewFeedback=async(req,res,next)=>{
    
    let feedbacks=[]
    if(req.authUser.role==="therapist"){
        feedbacks=await Feedback.find({therapistId:req.authUser._id})
    }
     if(req.authUser.role==="user"){
        feedbacks=await Feedback.find({userId:req.authUser._id})
    }
    
    if(feedbacks.length===0){
        return next(new AppError(messages.feedback.notFound,404))
    }

    return res.status(200).json({
        success:true,
        data:feedbacks
    })
}