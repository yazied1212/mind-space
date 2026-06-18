import { User } from "../../db/models/user.js";
import { Session } from "../../db/models/session.js";
import { AppError, messages, roles } from "../../utils/index.js";

export const requestSession = async (req, res, next) => {
    const { therapistId, sessionTime } = req.body;
    const userId = req.authUser._id;

    // 1. Verify Therapist exists
    const therapist = await User.findOne({ _id: therapistId, role: roles.therapist });
    if (!therapist) {
        return next(new AppError("Therapist not found.", 404));
    }

    // 2. Create the Request
    const newRequest = await Session.create({
        userId,
        therapistId,
        sessionTime: new Date(sessionTime),
        status: "scheduled", // Fixed as pending until therapist acts
        messages: []
    });

    return res.status(201).json({
        success: true,
        message: "Session request sent. Waiting for therapist confirmation.",
        data: newRequest
    });
};

export const confirmSession = async (req , res , next)=>{
const { sessionId } = req.params;
    const therapistId = req.authUser._id; // Logged in therapist

    // 1. Find the session and ensure it belongs to this therapist
    const session = await Session.findOne({ _id: sessionId, therapistId });

    if (!session) {
        return next(new AppError("Session request not found.", 404));
    }

    // 2. Ensure the session is actually in 'pending' state
    if (session.status !== "confirmed") {
        return next(new AppError(`Cannot confirm a session that is already ${session.status}`, 400));
    }

    // 3. Update status to scheduled
    session.status = "confirmed";
    await session.save();

    return res.status(200).json({
        success: true,
        message: "Session confirmed and scheduled successfully.",
        data: session
    });

}

export const cancelSession = async (req, res, next) => {
    const { sessionId } = req.params;
    const userId = req.authUser._id;
    const userRole = req.authUser.role;

    // 1. Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
        return next(new AppError("Session not found.", 404));
    }

    // 2. Auth Check: Only the involved Patient or Therapist can cancel
    const isPatient = session.userId.toString() === userId.toString();
    const isTherapist = session.therapistId.toString() === userId.toString();

    if (!isPatient && !isTherapist) {
        return next(new AppError("You are not authorized to cancel this session.", 403));
    }

    // 3. Status Check: Don't cancel if it's already finished or canceled
    if (["finished", "canceled"].includes(session.status)) {
        return next(new AppError(`Cannot cancel a session that is already ${session.status}.`, 400));
    }

    // 4. Update status
    session.status = "canceled";
    await session.save();

    return res.status(200).json({
        success: true,
        message: "Session has been canceled successfully.",
        data: session
    })
    }

export const delaySession = async (req, res, next) => {
    const { sessionId } = req.params;
    const { newTime } = req.body;
    const userId = req.authUser._id;
    const userRole = req.authUser.role; // Added to check who is calling

    const session = await Session.findById(sessionId);
    if (!session) return next(new AppError("Session not found.", 404));

    // Check if caller is part of this session
    const isPatient = session.userId.toString() === userId.toString();
    const isTherapist = session.therapistId.toString() === userId.toString();

    if (!isPatient && !isTherapist) {
        return next(new AppError("Not authorized.", 403));
    }

    // Update time and RESET status to pending
    session.sessionTime = new Date(newTime);
    session.status = "scheduled"; // <--- THIS IS THE KEY CHANGE
    
    await session.save();

    // Custom message based on the role
    const message = userRole === roles.therapist 
        ? "New time proposed. You still need to confirm this to make it 'scheduled'." 
        : "Delay requested. The therapist must confirm this new time.";

    return res.status(200).json({ success: true, message, data: session });
};

export const getAllSessions=async(req,res,next)=>{

    const sessions=await Session.find({ $or: [
      { therapistId: req.authUser.id },
      { userId: req.authUser.id }
    ]},{messages:0}).populate("userId", "userName","pfp");
    if(sessions.length===0){
        return next(new AppError(messages.session.notFound,404))
    }

    return res.status(200).json({
        success:true,
        data:sessions
    })
}


export const getSpecificSession=async(req,res,next)=>{
    const {sessionId}=req.params

    const session=await Session.findById(sessionId)
    if(!session){
        return next(new AppError(messages.session.notFound,404))
    }
    if(session.userId!=req.authUser._id&&session.therapistId!=req.authUser._id){
        return next(new AppError("you are not part of this session",401))
    }


    return res.status(200).json({
        success:true,
        data:session
    })
}

export default delaySession;