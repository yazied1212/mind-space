import { Feedback } from "../../db/models/feedback.js"
import { User } from "../../db/models/user.js";
import { AppError, messages } from "../../utils/index.js"

//give feedback
export const addFeedbacks = async(req,res,next)=>{
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




//view feedbacks
export const viewFeedbacks=async(req,res,next)=>{
    
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