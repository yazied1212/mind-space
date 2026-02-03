import { Feedback } from "../../db/models/feedback.js"
import { AppError, messages } from "../../utils/index.js"

//give feedback

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